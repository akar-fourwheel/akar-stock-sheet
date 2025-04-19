import googleSecurityHeader from '../../mixins/googleSecurityHeader.js';

async function bookingFormController(req, res) {
    const QUOT_SHEET_ID = "1H-O8RrC31_TWMJ-QxCBSO7UXXRFTYUQ9Uz8Rvpv2Nkc";
    const { quoteID } = req.query;
    
    const query = `SELECT C, D, I, L, M, AD, BM, G, K WHERE A = '${quoteID}'`
    const token = await googleSecurityHeader();

    const url = `https://docs.google.com/spreadsheets/d/${QUOT_SHEET_ID}/gviz/tq?sheet=QuotationSheet&tq=${query}&access_token=${token}`;

    try {
        const resu = await fetch(url);
        const text = await resu.text();
        const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g, "").replace(/google.visualization.Query.setResponse\(/, "");
        const data = JSON.parse(jsonText);
        const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));

        res.send(rows.flat());
    }
    catch (e) {
        console.log("data not found");
        console.log(e);

        res.send("data not found")
    }
}

export default bookingFormController;