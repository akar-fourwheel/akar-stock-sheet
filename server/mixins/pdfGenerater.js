import pdf from "pdf-creator-node";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

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

// API Route to Generate PDF
const generatePDF = async (req, res) => {
  try {
    const Qdata = req.body;
    
    const document = {
      html: htmlTemplate,
      data: { Qdata },
      path: "./output.pdf",
      type: "", // or "buffer"/"stream"
    };

    await pdf.create(document, options);

    res.download(document.path, "Quotation.pdf", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error sending file");
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};

export default generatePDF;
