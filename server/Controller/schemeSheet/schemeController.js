import googleSecurityHeader from '../../mixins/googleSecurityHeader.js';

const SHEET_ID = '1xqIGEgdU5hMXrXdkddBR5teWKpd0baIGRW123WT7j1M';

const schemeController = async (req,res) => {

    const {'year':carYear,'model':carModel,'fuel':carFuel, 'variant': carVariant} = req.query;
    console.log(carYear, carModel, carFuel);

    const token = await googleSecurityHeader();
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tq=${query}&access_token=${token}`;
    let query;
  
    if(carYear && carModel && carFuel){
      query = encodeURIComponent(`SELECT L, N,C, COUNT(L) WHERE D = '${carYear}' AND J='${carModel}' AND K='${carFuel}' GROUP BY D, J, K, L, N,C ORDER BY C DESC`)
    }
  
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
        res.send("data not found")
    }
}

export default schemeController;