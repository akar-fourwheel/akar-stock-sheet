import googleSecurityHeader from "../../mixins/googleSecurityHeader.js";
const SHEET_ID = '15V2kDmWh7HQeghHxW5_u0Tte_-yETeJb';

const dealerFormData = async (req, res) => {

    const {'year':carYear,'model':carModel,'fuel':carFuel} = req.query;
    
    let query;
  
    if(carYear && carModel && carFuel){
      query = encodeURIComponent(`SELECT L, N,C, COUNT(L) WHERE D = '${carYear}' AND J='${carModel}' AND K='${carFuel}' GROUP BY D, J, K, L, N,C ORDER BY C DESC`)
    }
  
  const token = await googleSecurityHeader();
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
    console.log("data not found");
    res.send("data not found");
  }
}

export default dealerFormData;