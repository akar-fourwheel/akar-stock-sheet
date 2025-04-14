import googleSecurityHeader, { serviceAccountAuth } from '../../mixins/googleSecurityHeader.js';
import { google } from "googleapis";

const STOCK_SHEET_ID = "1LHbJCVD_MWP9jFyfD16d-EF8dpmqKjh5EANPNPJ3r7g";
const BOOK_SHEET_ID = "1tDWKz804lqfo0syFuD8gBLGwdVdwcWoUfPro0Yc41AA"
const sheets = google.sheets({version: 'v4', auth: serviceAccountAuth})

const bookingProcessController = async(req,res) => {    
    // const {chassisNo} = req.query;
    const { quoteID, year, bookingAmount, RemainingAmount, color, variant } = req.body;
    console.log(year, variant, color);
    
    // const year = '2025';
    // const variant = 'Tigor (P) XZ+ MYC';
    // const color = 'PRISTIN_WHTE';

    // checking if car is still available    
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
            upper(row[10]) === upper(variant) &&
            upper(row[12]) === upper(color);
      
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
    
    try {
        // Get car data and row index to delete
        const { carToBook, rowIdx } = await status();
        console.log(carToBook, rowIdx);
        
      
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
      
        // Push car data to Booking Stock
        await sheets.spreadsheets.values.append({
          spreadsheetId: BOOK_SHEET_ID,
          range: "Sheet1",
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: [carToBook],
          },
        });
      
        // Return car info (like model or variant)
        console.log(carToBook[6]);
        res.send({chassisNo : carToBook[6]});
      
      }
    catch(e){
        console.log("No Matching Car Found!");
        res.send("No Matching Car Found!");
    }
}

export default bookingProcessController;