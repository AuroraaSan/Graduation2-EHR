import { Allergy, MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import { NotFoundError, ValidationError } from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { createAllergySchema } from '../../validators/schemas/index.js';

export const createAllergy = async (req, res) => {
    validate(createAllergySchema);
    const {
      medical_record_id,
      allergen_name,
      allergen_type,
      reaction,
      severity,
      diagnosis_date,
      onset_date,
      treatment_plan,
      emergency_instructions,
      medications_to_avoid,
    } = req.body;

    const doctor_id = req.user?.id;
    if (!doctor_id) {
      throw new ValidationError('Doctor ID not provided', { field: 'doctor_id' });
    }

    // Verify medical record exists
    const medicalRecord = await MedicalRecord.findById(medical_record_id);
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record', medical_record_id);
    }

    const allergy = new Allergy({
      medical_record_id,
      allergen_name,
      allergen_type,
      reaction,
      severity,
      diagnosing_doctor_id: doctor_id,
      diagnosis_date,
      onset_date,
      treatment_plan,
      emergency_instructions,
      medications_to_avoid,
      status: 'Active',
      verification_status: 'Confirmed',
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
  };
