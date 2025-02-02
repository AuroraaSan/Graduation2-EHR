import { Medication, MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import { NotFoundError, ValidationError } from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { createMedicationSchema } from '../../validators/schemas/index.js';

export const createMedication = async (req, res) => {
    validate(createMedicationSchema); // Validation middleware will run before the controller
    const {
      medical_record_id,
      medication_name,
      dosage,
      frequency,
      start_date,
      end_date,
      condition,
      route_of_administration,
      side_effects,
      contraindications,
      refills_remaining,
      pharmacy_notes,
      prescription_id,
    } = req.body;

    // doctor id should be provided after authentication and authorization
    const doctor_id = req.body?.doctor_id;
    if (!doctor_id) {
      throw new ValidationError('Doctor ID not provided', { field: 'doctor_id' });
    }

    // Verify medical record exists
    const medicalRecord = await MedicalRecord.findById(medical_record_id);
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record', medical_record_id);
    }

    const medication = new Medication({
      medical_record_id,
      medication_name,
      dosage,
      frequency,
      start_date,
      end_date,
      prescribing_doctor_id: doctor_id,
      condition,
      route_of_administration,
      side_effects,
      contraindications,
      refills_remaining,
      pharmacy_notes,
      prescription_id,
      status: 'Active',
    });

    const savedMedication = await medication.save();

    // Update medical record with the new medication
    await MedicalRecord.findByIdAndUpdate(
      medical_record_id,
      { $push: { medications: savedMedication._id } }
    );

    await createAuditLog({
      medical_record_id,
      collection_name: 'medications',
      document_id: savedMedication._id,
      action: 'CREATE',
      changes: {
        after: savedMedication.toObject(),
      },
      doctor_id,
      reason: `New medication prescribed: ${medication_name}`,
      req,
    });

    return sendSuccess(res, savedMedication, 'Medication prescribed successfully', 201);
  };