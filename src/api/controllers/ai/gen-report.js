import { MedicalRecord, Visit } from "../../../models/models-index.js";
import { createAuditLog } from "../../../utils/audit-logger.js";
import { NotFoundError } from "../../../utils/errors.js";
import fs from "fs";
import * as utils from "../../../utils/utils-index.js";
import path from "path";
import { fileURLToPath } from "url";
import {
  ai_service,
  azureReportsContainerName,
} from "../../../config/config.js";
import uploadFileToAzure from "./upload-report.js";
import { generatePdfFileName } from "../../../utils/utils-index.js";
import doc from "pdfkit";

const sanitizeFileName = (fileName) => {
  return fileName.replace(/[<>:"/\\|?*]+/g, "-");
};

const aiPostExamReport = async (patient_id, visit_id) => {
  const response = await fetch(
    `http://${ai_service}/generate_report/${patient_id}`,
    {
      method: "POST",
      body: {
        visit_id,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // Parse the JSON response
  const jsonResponse = await response.json();
  console.log("jsonResponse:", jsonResponse);

  // Extract the HTML report from the JSON response
  const htmlReport = jsonResponse.html_report;
  console.log("htmlReport:", htmlReport);

  if (!htmlReport) {
    throw new Error("No HTML report found in the AI response");
  }

  return htmlReport;
};

export const genPostExamReport = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { visit_id } = req.body;

    // Get the visit from the database
    const visit = await Visit.findById(visit_id);

    if (!visit) {
      throw new NotFoundError(`Visit not found with ID: ${visit_id}`, {
        visit_id,
      });
    }

    // Get the current file path
    const __filename = fileURLToPath(import.meta.url);
    // Get the directory name
    const __dirname = path.dirname(__filename);
    const pdfFileName = sanitizeFileName(
      generatePdfFileName(patient_id, visit_id)
    );
    console.log("__dirname:", __dirname);

    const tempDir = path.join(__dirname, "../temp");

    console.log("tempDir:", tempDir);

    // Ensure the temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const pdfFilePath = path.join(tempDir, pdfFileName);
    console.log("pdfFilePath:", pdfFilePath);
    console.log("pdfFileName:", pdfFileName);

    // Send request to AI service and get the HTML report
    const htmlResponse = await aiPostExamReport(patient_id, visit_id);
    console.log("htmlResponse:", htmlResponse);

    if (!htmlResponse || htmlResponse === "Not Found") {
      throw new Error('AI service returned "Not Found" or empty response');
    }

    // Create PDF report
    await utils.createPDF(htmlResponse, patient_id, pdfFilePath);

    // Upload file to Azure Blob Storage
    await uploadFileToAzure(
      azureReportsContainerName,
      pdfFilePath,
      pdfFileName
    );
    console.log(`PDF_FILE_NAME: ${pdfFileName}`);
    visit.report_ref = pdfFileName;
    await visit.save();

    // Optionally, delete the file after uploading
    fs.unlinkSync(pdfFilePath);

    await createAuditLog(req, {
      action: "CREATE",
      patient_id,
      report_url: pdfFileName,
      doctor_id: req.auth.payload.sub,
    });
    return utils.sendSuccess(
      res,
      {},
      "Report generated and uploaded successfully"
    );
  } catch (error) {
    return utils.sendError(res, error);
  }
};
