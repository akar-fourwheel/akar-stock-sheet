const plantFormData = async (req, res) => {

    const {'year':carYear,'model':carModel,'fuel':carFuel} = req.query;
    console.log(carYear,carFuel,carModel);
    
    let query;
  
    if(carYear=='2024' && carModel && carFuel){
      query = encodeURIComponent(`SELECT E, D, R WHERE A='${carModel}' AND F='${carFuel}'`)
    }

    if(carYear=='2025' && carModel && carFuel){
        query = encodeURIComponent(`SELECT E, D, AC WHERE A='${carModel}' AND F='${carFuel}'`)
      }
  const SHEET_ID = '1eKs7_vXp1bqlc2fUjpppYDXfB9YRENM_';  
  
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tq=${query}`
  
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
    res.send("data not found");
  }
}

export default plantFormData;