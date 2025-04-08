import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import { serviceAccountAuth } from "./googleSecurityHeader.js";
import { google } from "googleapis";
import randomID from '../mixins/randomID.js';
import { Readable } from "stream";
import fs from "fs/promises";
import sendWhatsapp from "./sendWhatsApp.js";
import Handlebars from "handlebars";

const browser = await puppeteer.launch({
  headless: true, // ← this is safer than "new" on remote servers
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

// Register ifCond helper globally
Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==": return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===": return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=": return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==": return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<": return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=": return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">": return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=": return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&": return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||": return v1 || v2 ? options.fn(this) : options.inverse(this);
    default: return options.inverse(this);
  }
});

// ES Module-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read HTML template
const htmlTemplate = await fs.readFile(path.join(__dirname, "template.html"), "utf8");

// Google APIs setup
const drive = google.drive({ version: "v3", auth: serviceAccountAuth });
const sheets = google.sheets({ version: "v4", auth: serviceAccountAuth });

const QUOTATION_FOLDER_ID = "1jsoZz9jDWXMVvL4AIphGok1A7mhKfYET";
const SPREADSHEET_ID = "1H-O8RrC31_TWMJ-QxCBSO7UXXRFTYUQ9Uz8Rvpv2Nkc";
const SHEET_NAME = "QuotationSheet";

const flattenJSON = (obj, prefix = "") => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.${k}` : k;
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenJSON(obj[k], pre));
    } else {
      acc[pre] = Array.isArray(obj[k]) ? JSON.stringify(obj[k]) : obj[k];
    }
    return acc;
  }, {});
};

const appendToSheet = async (Qdata) => {
  try {
    const flatData = flattenJSON(Qdata);
    const row = Object.values(flatData);
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
  } catch (err) {
    console.error("Error adding to Google Sheet:", err);
  }
};

const uploadToDrive = async (pdfBuffer, filename, folderId) => {
  const fileMetadata = {
    name: filename,
    parents: [folderId],
  };

  const media = {
    mimeType: "application/pdf",
    body: Readable.from(pdfBuffer instanceof Buffer ? [pdfBuffer] : [Buffer.from(pdfBuffer)]),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });

  return response.data.id;
};

const makeFilePublic = async (fileId) => {
  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });
  return `https://drive.google.com/file/d/${fileId}/view`;
};

const generatePDFBuffer = async (htmlContent) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const buffer = await page.pdf({
    format: "A3",
    printBackground: true,
    margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
  });

  await browser.close();
  return buffer;
};

const generatePDF = async (req, res) => {
  try {
    const Qname = req.body.name;
    const Qmobile = req.body.mobile;
    const Qdate = req.body.date;
    const Qbody = req.body;

    const randomId = await randomID(Qname, Qmobile, Qdate);
    const Qdata = { quotationID: randomId, ...Qbody };

    const logoPath = path.join(__dirname, 'logo.jpg');
    const logoBuffer = await fs.readFile(logoPath);
    const logoBase64 = logoBuffer.toString('base64');
    const logoSrc = `data:image/png;base64,${logoBase64}`;

    // ✅ Compile and fill HTML template using Handlebars
    const template = Handlebars.compile(htmlTemplate);
    const filledHtml = template({ Qdata, logoSrc });

    // ✅ Generate PDF
    const pdfBuffer = await generatePDFBuffer(filledHtml);

    const fileId = await uploadToDrive(pdfBuffer, `${Qdata.name}_${randomId}.pdf`, QUOTATION_FOLDER_ID);
    const publicUrl = await makeFilePublic(fileId);
    Qdata.fileUrl = publicUrl;
    const whatsAppUrl = sendWhatsapp(Qdata);
    Qdata.waUrl = whatsAppUrl;
    await appendToSheet(Qdata);
    console.log(Qdata.waUrl);
    

    res.status(200).send({ whatsAppUrl, publicUrl });
  } catch (error) {
    console.error("Error generating or uploading PDF:", error);
    res.status(500).send("Error generating or uploading PDF");
  }
};

export default generatePDF;
