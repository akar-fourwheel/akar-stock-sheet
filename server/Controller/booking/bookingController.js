import googleSecurityHeader from '../../mixins/googleSecurityHeader.js';

const bookingController = async(req,res) => {
    const {chassisNo} = req.query;
    const token = await googleSecurityHeader();

    // checking if car is still available    
    const status = async(req,res) =>{

        query = encodeURIComponent(`SELECT * WHERE x='${chassisNo}'`)
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=DealerStock&tq=${query}&access_token=${token}`;

        try{
            const resu = await fetch(url);
            const text = await resu.text();
            const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
            const data = JSON.parse(jsonText);
            const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
            
            res.send(rows.length); 
          }
        catch(e){
          console.log("data fetch error in booking");
          res.send("data fetch error in booking");
        }
    }

    if(status!=0){
        try{
            //copy data from dealer stock
            // delete row from dealer stock based on oldest age and color
            //push data in booking stock
            //return cars info
            }
        catch(e){
            console.log("data manipulation error in");
            res.send("data manipulation error in");
        }
    }
}

export default bookingController;