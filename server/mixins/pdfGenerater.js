import pdf from "pdf-creator-node";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serviceAccountAuth } from "./googleSecurityHeader.js";
import { google } from "googleapis";
import mime from "mime-types";

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

// 👇 Define your target Google Drive folder ID here
const QUOTATION_FOLDER_ID = "1jsoZz9jDWXMVvL4AIphGok1A7mhKfYET";

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
    const Qdata = req.body;

    const outputPath = path.join(__dirname, "output.pdf");

    const document = {
      html: htmlTemplate,
      data: { Qdata },
      path: outputPath,
      type: "",
    };

    await pdf.create(document, options);

    // Upload to a specific folder
    const fileId = await uploadToDrive(outputPath, `${Qdata.name}_${Qdata.mobile}.pdf`, QUOTATION_FOLDER_ID);
    const publicUrl = await makeFilePublic(fileId);
    Qdata.fileUrl = publicUrl;

    console.log(Qdata);
    

    res.status(200).json({ fileId });
  } catch (error) {
    console.error("Error generating or uploading PDF:", error);
    res.status(500).send("Error generating or uploading PDF");
  }
};

export default generatePDF;
