import googleSecurityHeader from "../../mixins/googleSecurityHeader.js";
const SHEET_ID = "1tDWKz804lqfo0syFuD8gBLGwdVdwcWoUfPro0Yc41AA";
const STOCK_SHEET_ID = process.env.SHEET_ID;

const BookingRequestNotification = async (req, res) => {
  try {
    const token = await googleSecurityHeader();
    const reqQuery = encodeURIComponent("SELECT A,B,C,D,E,F,G");
    const reqUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=RequestedStock&tq=${reqQuery}&access_token=${token}`;

    const reqStock = await getRequestedStock(reqUrl);

    const result = [];

    for (const row of reqStock) {
      const [_, __, ___, c, k, j, m] = row; // indexes 3,4,5,6

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

    return rows.slice(1); // skip headers
  } catch (e) {
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
