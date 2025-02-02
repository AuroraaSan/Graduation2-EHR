export function generatePdfFileName(patientId) {
  const timestamp = Date.now();
  return `patient-${patientId}-${timestamp}-report.pdf`;
}
