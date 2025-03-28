import express from 'express'
import cors from 'cors'
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import 'dotenv/config'

const app = express();
const PORT = 3000;
// require('dotenv').config()

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('/', async (req, res) => {
  const query = encodeURIComponent("SELECT MAX(D) GROUP BY D")
  const url = `https://docs.google.com/spreadsheets/d/15V2kDmWh7HQeghHxW5_u0Tte_-yETeJb/gviz/tq?tq=${query}`

  const resu = await fetch(url);
  const text = await resu.text();
  const jsonText = text.replace(/^.*?\(/, "").slice(0, -2).replace(/\/\*.*?\*\//g,"").replace(/google.visualization.Query.setResponse\(/, "");
  const data = JSON.parse(jsonText);  
  const rows = data.table.rows.map(row => row.c.map(cell => (cell ? cell.v : null)));
  
  res.send(rows);

})

app.get('/dealership-data',cors(corsOptions), async (req, res) => {

  const {'year':carYear,'model':carModel,'fuel':carFuel} = req.query;
  console.log(carYear);
  
  let query;
  if(!carYear && !carModel && !carFuel){
    query = encodeURIComponent("SELECT MAX(D) GROUP BY D")
  }

  if(carYear && !carModel && !carFuel){ 
    query =encodeURIComponent(`SELECT MAX(J) WHERE D = '${carYear}' GROUP BY J`)
  }

  if(carYear && carModel && !carFuel){
    query = encodeURIComponent(`SELECT MAX(K) WHERE D = '${carYear}' AND J='${carModel}' GROUP BY K`)
  }
  if(carYear && carModel && carFuel){
    query = encodeURIComponent(`SELECT D, J, K, L, N, COUNT(L) WHERE D = '${carYear}' AND J='${carModel}' AND K='${carFuel}' GROUP BY D, J, K, L, N`)
  }
  
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

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
});

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});