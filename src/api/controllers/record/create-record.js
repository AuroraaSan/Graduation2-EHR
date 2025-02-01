import { MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, asyncHandler, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import {
  ConflictError,
  ForbiddenError,
} from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { createRecordSchema } from '../../validators/schemas/index.js';
import { VerifyAdmissionStatus } from '../../../utils/redis-fetch.js';

const createRecord = async (req, res) => {
  try {
    validate(createRecordSchema);
    const { patient_id, blood_type, weight, height } = req.body;
    const doctor_id = req.auth.payload.sub;

    if (await VerifyAdmissionStatus(patient_id, doctor_id) === false) {
      throw new ForbiddenError('Doctor is not assigned to this patient');
    }

    // Check if medical record already exists
    const existingRecord = await MedicalRecord.findOne({ patient_id }, { _id: 1 }).lean();
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
      height,
    });

    const savedRecord = await medicalRecord.save();

    // Save a new audit log to track actions in the system
    await createAuditLog({
      medical_record_id: savedRecord._id,
      collection_name: 'medical_records',
      document_id: savedRecord._id,
      action: 'CREATE',
      doctor_id: 'DR123456',
      changes: {
        after: savedRecord.toObject(),
      },
      reason: 'Initial medical record creation',
      status: 'Success',
      req,
    });

    return sendSuccess(res, savedRecord, 'Medical record created successfully', 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(createRecord);
