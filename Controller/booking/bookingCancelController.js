import { serviceAccountAuth } from '../../services/googleSecurityHeader.js';
import { google } from "googleapis";

const STOCK_SHEET_ID = "1LHbJCVD_MWP9jFyfD16d-EF8dpmqKjh5EANPNPJ3r7g";
const BOOK_SHEET_ID = "1tDWKz804lqfo0syFuD8gBLGwdVdwcWoUfPro0Yc41AA";

const sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });

async function bookingCancelController(req, res) {
  const { chassis } = req.query;
  console.log("Chassis to cancel:", chassis);

  try {
    const { carToCancel, rowIdx } = await status(chassis);

    if (!carToCancel) {
      return res.status(404).json({ message: "Car not found in booking sheet" });
    }

    // Extract columns E (index 4) to W (index 22)
    const dataToMove = carToCancel.slice(4, 23);

    // Append to the stock sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: STOCK_SHEET_ID,
      range: 'DealerStock',
      valueInputOption: 'RAW',
      requestBody: {
        values: [dataToMove]
      }
    });

    // Mark the booking as "cancelled" in column Z (index 25) on the original row
    const cellToUpdate = `Sheet1!Z${rowIdx + 1}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: BOOK_SHEET_ID,
      range: cellToUpdate,
      valueInputOption: 'RAW',
      requestBody: {
        values: [["cancelled"]]
      }
    });

    res.status(200).json({ message: "Booking cancelled successfully." });

  } catch (e) {
    console.error("Error cancelling booking:", e);
    res.status(500).json({ message: "An error occurred during cancellation." });
  }
}

const status = async (chassis) => {
  let rowIdx = -1;

  const getRes = await sheets.spreadsheets.values.get({
    spreadsheetId: BOOK_SHEET_ID,
    range: "Sheet1"
  });

  const rows = getRes.data.values || [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[10] === chassis) { // assuming chassis is in column K (index 10)
      rowIdx = i;
      break;
    }
  }

  if (rowIdx === -1) {
    console.log("No matching car found.");
    return null;
  }

  const carToCancel = rows[rowIdx];
  return { carToCancel, rowIdx };
};

export default bookingCancelController;
