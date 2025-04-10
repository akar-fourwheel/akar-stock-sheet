import googleSecurityHeader from '../../mixins/googleSecurityHeader.js'

const SHEET_ID = process.env.SHEET_ID; 

const plantFormData = async (req, res) => {

    const {'year':carYear,'model':carModel,'fuel':carFuel} = req.query;
    
    let query;
  
    if(carYear=='2024' && carModel && carFuel){
      query = encodeURIComponent(`SELECT E, D, R WHERE A='${carModel}' AND F='${carFuel}'`)
    }

    if(carYear=='2025' && carModel && carFuel){
        query = encodeURIComponent(`SELECT E, D, AC WHERE A='${carModel}' AND F='${carFuel}'`)
      }
  
  const token = await googleSecurityHeader();
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=PlantStock&tq=${query}&access_token=${token}`;
  
  try{
      const resu = await fetch(url);
      const text = await resu.text();
      const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
      const data = JSON.parse(jsonText);
      const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
      const filteredData = rows.filter(row => !row.includes(0));

      res.send(filteredData);
    }
  catch(e){
    console.log("data not found");
    
    res.send("data not found");
  }
}

export default plantFormData;