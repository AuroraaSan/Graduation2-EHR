import { MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, asyncHandler } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import {
  ValidationError,
  ConflictError
} from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { createRecordSchema } from '../../validators/schemas/index.js';

export default [
  validate(createRecordSchema),
  asyncHandler(async (req, res) => {
    const { patient_id, blood_type, weight, height } = req.body;

  // will only run once when creating a new patient

  // Check if medical record already exists
  const existingRecord = await MedicalRecord.findOne({ patient_id });
  if (existingRecord) {
    throw new ConflictError(
      `Medical record already exists for patient ${patient_id}`,
      { patient_id }
    );
  }
  
  const medicalRecord = new MedicalRecord({
    patient_id,
    blood_type,
    weight,
    height
  });
  
  const savedRecord = await medicalRecord.save();
  
  // Save a new audit log to track actions in the system
  await createAuditLog({
    medical_record_id: savedRecord._id,
    collection_name: 'medical_records',
    document_id: savedRecord._id,
    action: 'CREATE',
    doctor_id: "DR123456",
    changes: {
      after: savedRecord.toObject()
    },
    reason: 'Initial medical record creation',
    status: 'Success',
    req
  });
  
  return sendSuccess(res, savedRecord, 'Medical record created successfully', 201);
})
];