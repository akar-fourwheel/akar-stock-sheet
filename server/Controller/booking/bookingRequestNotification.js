import googleSecurityHeader from "../../mixins/googleSecurityHeader.js";
const SHEET_ID = "1tDWKz804lqfo0syFuD8gBLGwdVdwcWoUfPro0Yc41AA"


const BookingRequestNotification = async(req,res) => {
    
    const query = encodeURIComponent("SELECT *")

    const token = await googleSecurityHeader();
    const url =  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=RequestedStock&tq=${query}&access_token=${token}`;
    
    try{
        const resu = await fetch(url);
        const text = await resu.text();
        const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
        const data = JSON.parse(jsonText);
        const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
        
        res.send(rows.slice(1)); 
      }
    catch(e){
      console.log("data not found");
      res.send("data not found");
    }
}

export default BookingRequestNotification;