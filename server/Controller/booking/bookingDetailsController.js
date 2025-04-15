import googleSecurityHeader from "../../mixins/googleSecurityHeader.js";
const SHEET_ID = '1tDWKz804lqfo0syFuD8gBLGwdVdwcWoUfPro0Yc41AA'

const bookingDetails = async(req,res) => {
    const { chassis } = req.query;
    const query = encodeURIComponent(`SELECT D,A,G,K,L,M,N,O,Q,X,Y WHERE K='${chassis}'`);
    const token = await googleSecurityHeader();
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=DealerStock&tq=${query}&access_token=${token}`;

    try{
        const resu = await fetch(url);        
        const text = await resu.text();
        const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
        const data = JSON.parse(jsonText);
        const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
        
        res.send(rows.flat());
    }
    catch(e){
        console.log(e);
        
    }

}

export default bookingDetails;