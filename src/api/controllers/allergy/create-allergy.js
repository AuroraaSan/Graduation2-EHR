import { Allergy, MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, asyncHandler, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { createAllergySchema } from '../../validators/schemas/index.js';
import { VerifyAdmissionStatus } from '../../../utils/redis-fetch.js';

const createAllergy = async (req, res) => {
  try {
    validate(createAllergySchema);
    const {
      patient_id,
      allergen_name,
      allergen_type,
      reaction,
      severity,
      diagnosis_date,
      onset_date,
      last_occurrence,
      treatment_plan,
      emergency_instructions,
      medications_to_avoid,
      status,
      verification_status,
      notes,
    } = req.body;

    const doctor_id = req.auth.payload.sub;

    if (!doctor_id) {
      throw new ValidationError('Doctor ID not provided', { field: 'doctor_id' });
    }

    if (await VerifyAdmissionStatus(patient_id, doctor_id) === false) {
      throw new ForbiddenError('Doctor is not assigned to this patient');
    }

    // Verify medical record exists
    const medicalRecord = await MedicalRecord.findOne({ patient_id });
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record', medicalRecord);
    }

    const medical_record_id = medicalRecord._id;

    const allergy = new Allergy({
      medical_record_id,
      patient_id,
      allergen_name,
      allergen_type,
      reaction,
      severity,
      diagnosing_doctor_id: doctor_id,
      diagnosis_date,
      onset_date,
      last_occurrence,
      treatment_plan,
      emergency_instructions,
      medications_to_avoid,
      status,
      verification_status,
      notes,
    });

    const savedAllergy = await allergy.save();

    // Update medical record with the new allergy
    await MedicalRecord.findByIdAndUpdate(
      medical_record_id,
      { $push: { allergies: savedAllergy._id } }
    );

    await createAuditLog({
      medical_record_id,
      collection_name: 'allergies',
      document_id: savedAllergy._id,
      action: 'CREATE',
      changes: {
        after: savedAllergy.toObject(),
      },
      doctor_id,
      reason: `New allergy documented: ${allergen_name}`,
      access_type: severity === 'Life-threatening' ? 'Emergency' : 'Regular',
      req,
    });

    return sendSuccess(res, savedAllergy, 'Allergy documented successfully', 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(createAllergy);
