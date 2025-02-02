import { MedicalRecord } from "../../../models/models-index.js";
import { sendSuccess, asyncHandler } from "../../../utils/response-handler.js";
import { createAuditLog } from "../../../utils/audit-logger.js";
import { ForbiddenError, NotFoundError } from "../../../utils/errors.js";
import { validate } from "../../validators/validator.js";
import { getRecordSchema } from "../../validators/schemas/index.js";
import { VerifyAdmissionStatus } from "../../../utils/redis-fetch.js";

const getRecord = async (req, res) => {
  try {
    validate(getRecordSchema);
    const { id: patient_id } = req.params;

    // Check if medical record already exists
    const record = await MedicalRecord.findOne({ patient_id })
      .populate("medical_conditions")
      .lean();
    console.log(record);

    if (!record) {
      throw new NotFoundError(
        `Medical record does not exist for patient ${patient_id}`,
        { patient_id }
      );
    }

    const doctor_id = req.auth.payload.sub;

    if ((await VerifyAdmissionStatus(patient_id, doctor_id)) === false) {
      throw new ForbiddenError("Doctor is not assigned to this patient");
    }

    // Save a new audit log to track actions in the system
    await createAuditLog({
      medical_record_id: record._id,
      doctor_id: req.auth.payload.sub,
      collection_name: "medical_records",
      document_id: record._id,
      action: "VIEW",
      reason: "Medical Record Viewed",
      req,
      doctor_id,
    });

    return sendSuccess(res, record);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(getRecord);
