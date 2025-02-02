import { BlobServiceClient } from "@azure/storage-blob";
import {
  azureStorageConnectionString,
  azureReportsContainerName,
} from "../../../config/config.js";

export default async function uploadFileToAzure(
  containerName,
  filePath,
  blobName
) {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      azureStorageConnectionString
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create the container if it doesn't exist
    await containerClient.createIfNotExists();

    // Upload the file
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(filePath);

    console.log(`File uploaded successfully. URL: ${blockBlobClient.url}`);
    return blockBlobClient.url; // Return the URI of the uploaded file
  } catch (error) {
    console.error("Error uploading file to Azure Blob Storage:", error);
    throw error;
  }
}
