import googleSecurityHeader from "../../services/googleSecurityHeader.js";
const SHEET_ID = process.env.SHEET_ID;

const dealerFormData = async (req, res) => {

    const {'year':carYear,'model':carModel,'fuel':carFuel} = req.query;
    
    let query;
  
    if(carYear && carModel && carFuel){
      query = encodeURIComponent(`SELECT K, M, B, COUNT(K) WHERE C = ${carYear} AND UPPER(I)='${carModel.toUpperCase()}' AND UPPER(J)='${carFuel.toUpperCase()}' GROUP BY I, J, K, M, B ORDER BY B DESC`)
    }
  
  const token = await googleSecurityHeader();
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=DealerStock&tq=${query}&access_token=${token}`;
  
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