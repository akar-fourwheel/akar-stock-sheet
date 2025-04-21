import googleSecurityHeader from "../../services/googleSecurityHeader.js";
const SHEET_ID = "1tDWKz804lqfo0syFuD8gBLGwdVdwcWoUfPro0Yc41AA";
const STOCK_SHEET_ID = process.env.SHEET_ID;

const today = new Date();
const fiveDaysAgo = new Date(today);
fiveDaysAgo.setDate(today.getDate() - 5);

// Format the date as yyyy-mm-dd (the format Google Sheets expects)
const year = fiveDaysAgo.getFullYear();
const month = (fiveDaysAgo.getMonth() + 1).toString().padStart(2, '0');
const day = fiveDaysAgo.getDate().toString().padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;
const BookingRequestNotification = async (req, res) => {
  try {
    const token = await googleSecurityHeader();
    const reqQuery = encodeURIComponent(`SELECT A,B,C,D,E,F,G,H WHERE H >= date '${formattedDate}'`);
    const reqUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=RequestedStock&tq=${reqQuery}&access_token=${token}`;

    const reqStock = await getRequestedStock(reqUrl);

    const result = [];

    for (const row of reqStock) {
      const [_, __, ___, c, k, j, m, h] = row; // indexes 3,4,5,6

      const dealQuery = encodeURIComponent(
        `SELECT C,K,J,M WHERE C='${c}' AND K='${k}' AND J='${j}' AND M='${m}'`
      );

      const dealUrl = `https://docs.google.com/spreadsheets/d/${STOCK_SHEET_ID}/gviz/tq?sheet=RequestedStock&tq=${dealQuery}&access_token=${token}`;
      const dealStock = await getDealerStock(dealUrl);

      const updatedRow = [...row]; // clone original row
      if (Array.isArray(dealStock) && dealStock.length > 0) {
        updatedRow.push("arrived");
      } else {
        updatedRow.push("requested");
      }

      result.push(updatedRow);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getRequestedStock = async (url) => {
  try {
    const resu = await fetch(url);
    const text = await resu.text();
    const jsonText = text
      .replace(/^.*?\(/, "")
      .slice(0, -2)
      .replace(/\/\*.*?\*\//g, "")
      .replace(/google.visualization.Query.setResponse\(/, "");
    const data = JSON.parse(jsonText);    
    const rows = data.table.rows.map((row) =>
      row.c.map((cell) => (cell ? cell.v : null))
    );
  
    return rows;
  } 
  catch (e) {
    console.log("data not found");
    return [];
  }
};

const getDealerStock = async (url) => {
  try {
    const resu = await fetch(url);
    const text = await resu.text();
    const jsonText = text
      .replace(/^.*?\(/, "")
      .slice(0, -2)
      .replace(/\/\*.*?\*\//g, "")
      .replace(/google.visualization.Query.setResponse\(/, "");
    const data = JSON.parse(jsonText);
    const rows = data.table.rows.map((row) =>
      row.c.map((cell) => (cell ? cell.v : null))
    );

    return rows;
  } catch (e) {
    console.log("dealer stock fetch failed");
    return [];
  }
};

export default BookingRequestNotification;
