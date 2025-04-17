import googleSecurityHeader, { serviceAccountAuth } from '../../mixins/googleSecurityHeader.js';
import { google } from "googleapis";

const STOCK_SHEET_ID = "1LHbJCVD_MWP9jFyfD16d-EF8dpmqKjh5EANPNPJ3r7g";
const BOOK_SHEET_ID = "1tDWKz804lqfo0syFuD8gBLGwdVdwcWoUfPro0Yc41AA"
const sheets = google.sheets({version: 'v4', auth: serviceAccountAuth})

const bookingProcessController = async(req,res) => {
    const { quoteID, year,sales_adv,customer, bookingAmount, RemainingAmount, color, variant } = req.body;
    console.log(year, variant, color);      
    
    try {
        // Get car data and row index to delete
        const { carToBook, rowIdx } = await status();
      
        // Delete the row from Dealer Stock
        const deleteRequest = {
          spreadsheetId: STOCK_SHEET_ID,
          resource: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: 1077003432,
                    dimension: 'ROWS',
                    startIndex: rowIdx,
                    endIndex: rowIdx + 1,
                  },
                },
              },
            ],
          },
        };
        await sheets.spreadsheets.batchUpdate(deleteRequest);

        const finalRow = ["BI-"+quoteID, quoteID,sales_adv,customer, ...carToBook, bookingAmount, RemainingAmount];        
      
        // Push car data to Booking Stock
        await sheets.spreadsheets.values.append({
          spreadsheetId: BOOK_SHEET_ID,
          range: "Sheet1",
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: [finalRow],
          },
        });
        // Send car info (like model or variant)
        res.send({chassisNo : carToBook[6]});
      
      }
    catch(e){
        console.log("Couldn't post!");
        res.send("Couldn't post!");
    }
}

const status = async () => {
  let rowIdx = -1;
  let maxAge = -Infinity;

  const getRes = await sheets.spreadsheets.values.get({
    spreadsheetId: STOCK_SHEET_ID,
    range: "DealerStock",
  });


  const rows = getRes.data.values || [];

  // Skip header
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const age = parseFloat(row[1]);

    const matches =
      row[2] === year &&
      row[10].toUpperCase() === variant.toUpperCase() &&
      row[12].toUpperCase() === color.toUpperCase();

    if (matches && !isNaN(age) && age > maxAge) {
      maxAge = age;
      rowIdx = i; // actual index in original sheet
    }
  }

  if (rowIdx === -1) {
    console.log("No matching car found.");
    return null;
  }

  const carToBook = rows[rowIdx];
  return { carToBook, rowIdx };
};

export default bookingProcessController;