import googleSecurityHeader, { serviceAccountAuth } from '../../mixins/googleSecurityHeader.js';
import { google } from "googleapis";

const STOCK_SHEET_ID = "1LHbJCVD_MWP9jFyfD16d-EF8dpmqKjh5EANPNPJ3r7g";
const sheets = google.sheets({version: 'v4', auth: serviceAccountAuth})

const bookingProcessController = async(req,res) => {    
    // const {chassisNo} = req.query;
    const year = '2024';
    const variant = 'Nexon Pure 1.2';
    const color = 'CALGARY_WHTE';

    // checking if car is still available    
    const status = async(req,res) =>{
        const getRes = await sheets.spreadsheets.values.get({
            spreadsheetId: STOCK_SHEET_ID,
            range: "DealerStock"
        });

        const rows = getRes.data.values || [];
        console.log(rows);
        
        // const rowIndex = rows.findIndex(row => row.includes(year) && row.includes(variant) && row.includes(color));        

        // if (rowIndex === -1) {
        //     console.log(`Value "${valueToDelete}" not found.`);
        //     return;
        // }
    }

    status();
    
    try{
        //copy data from dealer stock
        const bookedCar = async() =>{
            const getRes = await sheets.spreadsheets.values.get({
                spreadsheetId: STOCK_SHEET_ID,
                range: "DealerStock!G:G"
            });
    
            const rows = getRes.data.values || [];
        // delete row from dealer stock based on oldest age and color
        const deleteRequest = {
            spreadsheetId,
            resource: {
              requests: [
                {
                  deleteDimension: {
                    range: {
                      sheetId: '1077003432',
                      dimension: 'ROWS',
                      startIndex: rowIndex,
                      endIndex: rowIndex + 1,
                    },
                  },
                },
              ],
            },
          };
        //push data in booking stock
        //return cars info
        }
    }
    catch(e){
        console.log("data manipulation error in");
        res.send("data manipulation error in");
    }
}

export default bookingProcessController;