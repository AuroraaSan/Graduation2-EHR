import { Condition, MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import { NotFoundError, ValidationError } from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { createConditionSchema } from '../../validators/schemas/index.js';

export const createCondition = async (req, res) => {
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

    const doctor_id = req.body?.doctor_id;
    if (!doctor_id) {
      throw new ValidationError('Doctor ID not provided', { field: 'doctor_id' });
    }

    // Verify medical record exists
    const medicalRecord = await MedicalRecord.findOne({ patient_id }).lean();
    if (!medicalRecord) {
      throw new NotFoundError(`Medical Record for patient with ID: ${patient_id}, not found.`);
    }

    const condition = new Condition({
      medical_record_id: medicalRecord._id,
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
      medicalRecord._id,
      { $push: { medical_conditions: savedCondition._id } }
    );

    await createAuditLog({
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
  };
