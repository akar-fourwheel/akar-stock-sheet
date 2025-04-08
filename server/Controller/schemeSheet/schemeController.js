import googleSecurityHeader from '../../mixins/googleSecurityHeader.js';

const SHEET_ID = '1xqIGEgdU5hMXrXdkddBR5teWKpd0baIGRW123WT7j1M';

const schemeController = async (req,res) => {

    const {'year':carYear,'model':carModel,'fuel':carFuel, 'variant': carVariant} = req.query;
    
    let query;

    const token = await googleSecurityHeader();
    
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
        query = encodeURIComponent(`SELECT E, F, G, H, I, J, K, L, M WHERE A = '${carYear}' AND B='${carModel}' AND C='${carFuel}' AND D='${carVariant}'`)
      }

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
        res.send("data not found")
    }
}

export default schemeController;