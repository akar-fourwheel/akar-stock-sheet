import { serviceAccountAuth } from '../../mixins/googleSecurityHeader.js';
import { google } from "googleapis";

const STOCK_SHEET_ID = "1LHbJCVD_MWP9jFyfD16d-EF8dpmqKjh5EANPNPJ3r7g";
const BOOK_SHEET_ID = "1tDWKz804lqfo0syFuD8gBLGwdVdwcWoUfPro0Yc41AA";

const sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });

const bookingFormController = async(req,res) => {

    const {quoteID,sales_adv,customer,year,variant,fuel,color} = req.body;
    const carData = [quoteID,sales_adv,customer,year,variant,fuel,color,"requesting"];

    try {
        await sheets.spreadsheets.values.append({
        spreadsheetId:BOOK_SHEET_ID,
        range:"RequestedStock",
        valueInputOption:"RAW",
        insertDataOption:"INSERT_ROWS",
        requestBody:{
            values:[carData]
        }
    });

    res.send("request raised!");
    }
    catch(e){
        console.log(e);
        res.send("could not request stock");
    }
    
}

export default bookingFormController;