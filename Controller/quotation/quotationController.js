import googleSecurityHeader from '../../services/googleSecurityHeader.js';

const SHEET_ID = '1H-O8RrC31_TWMJ-QxCBSO7UXXRFTYUQ9Uz8Rvpv2Nkc';

const quotationController = async (req,res) =>{
    
    const {'year':carYear,'model':carModel,'fuel':carFuel, 'variant': carVariant} = req.query;    
  
    let query, queryAcc, queryColor;
    if(!carYear && !carModel && !carFuel && !carVariant){
      query = encodeURIComponent("SELECT MAX(A) GROUP BY A")
    }
    
    if(carYear && !carModel && !carFuel && !carVariant){
      query =encodeURIComponent(`SELECT MAX(B) WHERE A = '${carYear}' GROUP BY B`)
    }
    
    if(carYear && carModel && !carFuel && !carVariant){
      query = encodeURIComponent(`SELECT MAX(C) WHERE A = '${carYear}' AND B='${carModel}' GROUP BY C`)
    }
    
    if(carYear && carModel && carFuel && !carVariant){
      query = encodeURIComponent(`SELECT MAX(D) WHERE A = '${carYear}' AND B='${carModel}' AND C='${carFuel}' GROUP BY D`)
    }
    
    if(carYear && carModel && carFuel && carVariant){
      query = encodeURIComponent(`SELECT * WHERE A = '${carYear}' AND B='${carModel}' AND C='${carFuel}' AND D='${carVariant}'`)
      queryAcc = encodeURIComponent(`SELECT C, D WHERE B = '${carModel}'`)
      queryColor = encodeURIComponent(`SELECT B WHERE A = '${carVariant}'`)
    }
    const token = await googleSecurityHeader();
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tq=${query}&access_token=${token}`
    const urlAcc = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Accessory&tq=${queryAcc}&access_token=${token}`
    const urlColor = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Color&tq=${queryColor}&access_token=${token}`
  
    try{
      const resu = await fetch(url);
      
      const text = await resu.text();
  
      const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
  
      const data = JSON.parse(jsonText);
  
      
      const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null))).flat();
      
      if (carYear && carModel && carFuel && carVariant) {
        const resuAcc = await fetch(urlAcc);
        const textAcc = await resuAcc.text();
        const dataAcc = JSON.parse(textAcc.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, ""));
        const rowsAcc = dataAcc.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null))).flat();
  
        const resuColor = await fetch(urlColor);
        const textColor = await resuColor.text();
        const dataColor = JSON.parse(textColor.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, ""));
        const rowsColor = dataColor.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null))).flat();
        const jsonColor = JSON.stringify(rowsColor.map(color => ({ label: color, value: color })));
        
        const cols = data.table.cols.map(lb => lb.label);
        const jsonData = JSON.stringify(Object.assign(...cols.map((element, index)=>({[element]: rows[index]}))));
        const jsonDataAcc = rowsAcc.reduce((acc, curr, index, arr) => {
          if (index % 2 === 0) {
            acc.push({ label: curr, value: arr[index + 1] || null });
          }
          return acc;
        }, []);
        res.send([jsonData, JSON.stringify(jsonDataAcc), jsonColor]);
      }
      else res.send(rows)
    }
  catch(e){
    res.send("data not found");
  } 
}

export default quotationController;