import express from 'express'

const dealerFormData = async (req, res) => {

    const {'year':carYear,'model':carModel,'fuel':carFuel} = req.query;
    console.log(carYear,carFuel,carModel);
    
    let query;
  
    if(carYear && carModel && carFuel){
      query = encodeURIComponent(`SELECT L, N, COUNT(L) WHERE D = '${carYear}' AND J='${carModel}' AND K='${carFuel}' GROUP BY D, J, K, L, N`)
    }
  const SHEET_ID = '15V2kDmWh7HQeghHxW5_u0Tte_-yETeJb';
  // const query =encodeURIComponent("SELECT MAX(J) GROUP BY J")
  // const query =encodeURIComponent("SELECT MAX(K) WHERE J='Altroz' GROUP BY K")
  // const query =encodeURIComponent("SELECT MAX(M) WHERE J='Altroz' AND K='Altroz XM+ 1.2 P' GROUP BY M")
  
  
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tq=${query}`
  // https://docs.google.com/spreadsheets/d/15V2kDmWh7HQeghHxW5_u0Tte_-yETeJb/gviz/tq?tq=SELECT
  
  try{
      const resu = await fetch(url);
      const text = await resu.text();
      const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
      const data = JSON.parse(jsonText);
      const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
  
      res.send(rows); 
    }
  catch(e){
    res.send("data not found");
  }
}

export default dealerFormData;