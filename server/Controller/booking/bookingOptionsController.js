import googleSecurityHeader from '../../mixins/googleSecurityHeader.js';

const SHEET_IT ='dede kutte uzair';

const bookingOptionsController = async(req,res) => {
    const query = 'SELECT M'
    const token = await googleSecurityHeader();

    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=QuotationSheet&tq=${query}&access_token=${token}`;

    try{
        const resu = await fetch(url);
        const text = await resu.text();
        const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
        const data = JSON.parse(jsonText);  
        const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
        
        res.send(rows);
    }
    catch(e){
        console.log("data not found");
        console.log(e);
    }

}

export default bookingOptionsController;
