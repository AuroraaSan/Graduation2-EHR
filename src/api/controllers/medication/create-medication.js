import { Medication, MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, asyncHandler, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { createMedicationSchema } from '../../validators/schemas/index.js';
import { VerifyAdmissionStatus } from '../../../utils/redis-fetch.js';

const createMedication = async (req, res) => {
  try {
    validate(createMedicationSchema);
    const {
      medication_name,
      patient_id,
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

    const doctor_id = req.auth.payload.sub;

    if (!doctor_id) {
      throw new ValidationError("Doctor ID not provided", {
        field: "doctor_id",
      });
    }

    if ((await VerifyAdmissionStatus(patient_id, doctor_id)) === false) {
      throw new ForbiddenError("Doctor is not assigned to this patient");
    }

    if (await VerifyAdmissionStatus(patient_id, doctor_id) === false) {
      throw new ForbiddenError('Doctor is not assigned to this patient');
    }

    // Verify medical record exists
    const medicalRecord = await MedicalRecord.findOne({ patient_id });
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record', patient_id);
    }

    const medication = new Medication({
      medical_record_id: medicalRecord._id,
      patient_id,
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
      status: "Active",
    });

    const savedMedication = await medication.save();

    // Update medical record with the new medication
    await MedicalRecord.findByIdAndUpdate(
      medicalRecord._id,
      { $push: { medications: savedMedication._id } }
    );

    await createAuditLog({
      medical_record_id: medicalRecord._id,
      collection_name: 'medications',
      document_id: savedMedication._id,
      action: "CREATE",
      changes: {
        after: savedMedication.toObject(),
      },
      doctor_id,
      reason: `New medication prescribed: ${medication_name}`,
      req,
    });

    return sendSuccess(res, savedMedication, 'Medication prescribed successfully', 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(createMedication);
