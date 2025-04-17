import googleleSecurityHeader from '../../mixins/googleSecurityHeader.js';

const SHEET_ID = process.env.SHEET_ID;

const zawlFormData = async (req, res) => {

    const {'model':carModel,'fuel':carFuel} = req.query;
    
    let query;
    
    if(carModel && carFuel){
      query = encodeURIComponent(`SELECT C,O,COUNT(O),L WHERE UPPER(B)='${carModel.toUpperCase()}' AND UPPER(D)='${carFuel.toUpperCase()}' GROUP BY B,C,D,O,L`) // year is in number
      
      // need to figure out how to group by
    }
    else{
      res.status(422).send("incomplete details")
    }
  
  
    const token = await googleleSecurityHeader();
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=ZAWL&tq=${query}&access_token=${token}`;
    
  try{
      const resu = await fetch(url);
      const text = await resu.text();
      
      const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
      
      const data = JSON.parse(jsonText);
      
      const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
      
      res.status(200).send(rows); 
    }
  catch(e){
    res.status(404).send("data not found");
  }
}

export default zawlFormData;