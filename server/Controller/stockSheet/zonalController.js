import googleSecurityHeader from '../../mixins/googleSecurityHeader.js'

const SHEET_ID = process.env.SHEET_ID;

const zonalFormData = async (req, res) => {

    const {'year':carYear,'model':carModel,'fuel':carFuel} = req.query;
    
    let query;
  
    if(carYear && carModel && carFuel){
      query = encodeURIComponent(`SELECT C,F,K,R,U WHERE M=${carYear} AND D='${carModel}' AND B='${carFuel}' AND G='Rajasthan' AND L='Available'`) // year is in number
      // need to figure out how to group by
    }
  
    const token = await googleSecurityHeader();
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=ZonalStock&tq=${query}&access_token=${token}`;
   
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

export default zonalFormData;