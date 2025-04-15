import googleSecurityHeader from "../../mixins/googleSecurityHeader.js";
const SHEET_ID = process.env.SHEET_ID;

const bookingColorController = async (req, res) => {

    const {'year':carYear,'variant':carVarient} = req.query;
    console.log(carYear,carVarient);
    
    
    let query;
  
    if(carYear && carVarient){
      query = encodeURIComponent(`SELECT MAX(M) WHERE C = '${carYear}' AND K='${carVarient}' GROUP BY M`);

    }
  
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
    console.log("color not found");
    res.send("data not found");
  }
}

export default bookingColorController;