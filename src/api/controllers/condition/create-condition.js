import { Condition, MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, asyncHandler, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { createConditionSchema } from '../../validators/schemas/index.js';
import { VerifyAdmissionStatus } from '../../../utils/redis-fetch.js';

const createCondition = async (req, res) => {
  try {
    validate(createConditionSchema);
    const {
      patient_id,
      condition_name,
      diagnosis_date,
      status,
      notes,
      severity,
      treatment_plan,
      expected_duration,
    } = req.body;

    const doctor_id = req.auth.payload.sub;
    if (!doctor_id) {
      throw new ValidationError('Doctor ID not provided', { field: 'doctor_id' });
    }

    if (await VerifyAdmissionStatus(patient_id, doctor_id) === false) {
      throw new ForbiddenError('Doctor is not assigned to this patient');
    }

    // Verify medical record exists
    const medicalRecord = await MedicalRecord.findOne({ patient_id }, { _id: 1 }).lean();
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record', medicalRecord);
    }

    const medical_record_id = medicalRecord._id;

    const condition = new Condition({
      patient_id,
      medical_record_id,
      condition_name,
      diagnosis_date,
      status,
      notes,
      diagnosing_doctor_id: doctor_id,
      severity,
      treatment_plan,
      expected_duration,
    });

    const savedCondition = await condition.save();

    // Update medical record with the new condition
    await MedicalRecord.findByIdAndUpdate(
      medical_record_id,
      { $push: { medical_conditions: savedCondition._id } }
    );

    await createAuditLog({
      medical_record_id,
      collection_name: 'conditions',
      document_id: savedCondition._id,
      action: 'CREATE',
      changes: {
        after: savedCondition.toObject(),
      },
      doctor_id,
      reason: `New condition diagnosed: ${condition_name}`,
      req,
    });

    return sendSuccess(res, savedCondition, 'Medical condition added successfully', 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(createCondition);
