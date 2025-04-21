import googleSecurityHeader from '../../services/googleSecurityHeader.js';

const SHEET_ID = '1H-O8RrC31_TWMJ-QxCBSO7UXXRFTYUQ9Uz8Rvpv2Nkc';

const initialFetchController = async (req,res) => {
    const token = await googleSecurityHeader();
    const query = encodeURIComponent("SELECT MAX(A) GROUP BY A")
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tq=${query}&access_token=${token}`;

    try{

        const resu = await fetch(url);
        const text = await resu.text();
        const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
        const data = JSON.parse(jsonText);  
        const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
        
        res.send(rows);
    }
    catch(e){
        console.log(e);
        res.send("data not found");
    }
}

export default initialFetchController;