export function generatePdfFileName(patientId, visit_id) {
  const timestamp = Date.now();
  return `patient-${patientId}-${visit_id}-${timestamp}-report.pdf`;
}
