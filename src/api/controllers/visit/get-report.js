import { Visit } from "../../../models/models-index.js";
import { NotFoundError } from "../../../utils/errors.js";
import * as utils from "../../../utils/utils-index.js";
import { BlobServiceClient } from "@azure/storage-blob";
import {
  azureReportsContainerName,
  azureStorageConnectionString,
} from "../../../config/config.js";

// Initialize Azure Blob Service Client and Container Client (outside the function for better performance)
const blobServiceClient = BlobServiceClient.fromConnectionString(
  azureStorageConnectionString
);
const containerClient = blobServiceClient.getContainerClient(
  azureReportsContainerName
);

export const getReport = async (req, res) => {
  const download = false; // Check if the user wants to download the file

  try {
    const { id: visit_id } = req.params;
    console.log("visit_id:", visit_id);

    // Find the visit by ID
    const visit = await Visit.findById(visit_id).lean();
    if (!visit) {
      throw new NotFoundError(`Visit not found with ID: ${visit_id}`, {
        visit_id,
      });
    }

    const report_ref = visit.report_ref;

    // Get the blob client for the specified file
    const blobClient = containerClient.getBlobClient(report_ref);

    // Check if the blob exists
    const exists = await blobClient.exists();
    if (!exists) {
      throw new NotFoundError("Report not found", {
        report_ref,
      });
    }

    // Get the blob properties
    const properties = await blobClient.getProperties();

    // Set headers based on whether the user wants to view or download the file
    if (download) {
      // Force download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${visit.report_ref.split("/").pop()}"`
      );
    } else {
      // View in the browser
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${visit.report_ref.split("/").pop()}"`
      );
    }

    // Set the content type and length
    res.setHeader("Content-Type", properties.contentType);
    res.setHeader("Content-Length", properties.contentLength);

    // Stream the file to the client
    const downloadResponse = await blobClient.download();
    downloadResponse.readableStreamBody.pipe(res);

    // Do NOT call utils.sendSuccess here, as the response is already being streamed
  } catch (error) {
    console.error("Error fetching report:", error);
    return utils.sendError(res, error);
  }
};
