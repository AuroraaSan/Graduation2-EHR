import { Surgery, MedicalRecord } from "../../../models/models-index.js";
import {
  sendSuccess,
  asyncHandler,
  sendError,
} from "../../../utils/response-handler.js";
import { createAuditLog } from "../../../utils/audit-logger.js";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../../../utils/errors.js";
import { validate } from "../../validators/validator.js";
import { createSurgerySchema } from "../../validators/schemas/index.js";
import { VerifyAdmissionStatus } from "../../../utils/redis-fetch.js";

const createSurgery = async (req, res) => {
  try {
    validate(createSurgerySchema);
    const {
      patient_id,
      type,
      procedure_date,
      hospital,
      assistant_surgeon_ids,
      anesthesiologist_id,
      pre_op_diagnosis,
      estimated_blood_loss,
      duration,
      post_op_instructions,
      follow_up_date,
      emergency,
      images,
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

    if ((await VerifyAdmissionStatus(patient_id, doctor_id)) === false) {
      throw new ForbiddenError("Doctor is not assigned to this patient");
    }

    if ((await VerifyAdmissionStatus(patient_id, doctor_id)) === false) {
      throw new ForbiddenError("Doctor is not assigned to this patient");
    }

    // Verify medical record exists
    const medicalRecord = await MedicalRecord.findOne({ patient_id });
    if (!medicalRecord) {
      throw new NotFoundError("Medical Record", patient_id);
    }

    const surgery = new Surgery({
      medical_record_id: medicalRecord._id,
      patient_id,
      type,
      procedure_date,
      hospital,
      surgeon_id: doctor_id,
      assistant_surgeon_ids,
      anesthesiologist_id,
      pre_op_diagnosis,
      estimated_blood_loss,
      duration,
      post_op_instructions,
      follow_up_date,
      emergency,
      images,
      status: "Scheduled",
    });

    const savedSurgery = await surgery.save();

    // Update medical record with the new surgery
    await MedicalRecord.findByIdAndUpdate(medicalRecord._id, {
      $push: { surgeries: savedSurgery._id },
    });

    await createAuditLog({
      medical_record_id: medicalRecord._id,
      collection_name: "surgeries",
      document_id: savedSurgery._id,
      action: "CREATE",
      changes: {
        after: savedSurgery.toObject(),
      },
      doctor_id,
      reason: `New surgery scheduled: ${type}`,
      access_type: emergency ? "Emergency" : "Regular",
      req,
    });

    return sendSuccess(
      res,
      savedSurgery,
      "Surgery scheduled successfully",
      201
    );
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(createSurgery);
