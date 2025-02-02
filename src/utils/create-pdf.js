import puppeteer from "puppeteer";

export async function createPDF(htmlContent, patient_id, pdfFilePath) {
  // Utility function to convert HTML to PDF
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0", // Wait for all resources to load
    });

    // Generate the PDF
    await page.pdf({
      path: pdfFilePath,
      format: "A4",
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });

    // Close the browser
    await browser.close();

    console.log(
      `PDF generated successfully for user with id ${patient_id} at ${pdfFilePath}`
    );
    return pdfFilePath;
  } catch (error) {
    console.error("Error converting HTML to PDF:", error);
    throw error;
  }
}
