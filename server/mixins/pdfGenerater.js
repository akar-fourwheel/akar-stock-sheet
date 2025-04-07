import pdf from "pdf-creator-node";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serviceAccountAuth } from "./googleSecurityHeader.js";
import { google } from "googleapis";
import mime from "mime-types";
import randomID from '../mixins/randomID.js'

// ES Module-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read HTML template once
const htmlTemplate = await fs.readFile(path.join(__dirname, "template.html"), "utf8");

// PDF generation options
const options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
};

// Initialize Drive API
const drive = google.drive({ version: "v3", auth: serviceAccountAuth });
const sheets = google.sheets({ version: "v4", auth: serviceAccountAuth });

// 👇 Define your target Google Drive folder ID here
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

    const headers = Object.keys(flatData);
    const row = Object.values(flatData);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    console.log("Quotation data added to sheet.");
  } catch (err) {
    console.error("Error adding to Google Sheet:", err);
  }
};

// Upload function with folder support
const uploadToDrive = async (filePath, filename, folderId) => {
  const fileMetadata = {
    name: filename,
    parents: [folderId], // 👈 Store in specific folder
  };

  const media = {
    mimeType: mime.lookup(filePath) || "application/pdf",
    body: fsSync.createReadStream(filePath),
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
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return `https://drive.google.com/file/d/${fileId}/view`;
};

// API Route to Generate PDF and Upload to Folder
const generatePDF = async (req, res) => {
  try {

    const Qname = req.body.name;
    const Qmobile = req.body.mobile;
    const Qdate = req.body.date;
    const Qbody = req.body;
    
    const randomId = await randomID(Qname,Qmobile,Qdate);
    console.log(randomId);
    

    const Qdata = {...{quotationID:randomId},...Qbody}
    console.log(Qdata);
    
    const outputPath = path.join(__dirname, "output.pdf");

    const document = {
      html: htmlTemplate,
      data: { Qdata },
      path: outputPath,
      type: "",
    };

    await pdf.create(document, options);

    // Upload to a specific folder
    const fileId = await uploadToDrive(outputPath, `${Qdata.name}_${randomId}.pdf`, QUOTATION_FOLDER_ID);
    const publicUrl = await makeFilePublic(fileId);
    Qdata.fileUrl = publicUrl;

    await appendToSheet(Qdata);
    

    res.status(200).json({ fileId });
  } catch (error) {
    console.error("Error generating or uploading PDF:", error);
    res.status(500).send("Error generating or uploading PDF");
  }
};

export default generatePDF;
