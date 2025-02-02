import { ai_service } from "../../../config/config.js";
import { MedicalRecord } from "../../../models/models-index.js";
import { sendSuccess, sendError } from "../../../utils/response-handler.js";
import { createAuditLog } from "../../../utils/audit-logger.js";
import {
  // ForbiddenError,
  NotFoundError,
} from "../../../utils/errors.js";
import { getUserFromRedis } from "../../../utils/redis-fetch.js";

const aiSummary = async (patient_id, specialization, patient_record) => {
  const response = await fetch(
    `http://${ai_service}/create_summary/?patient_id=${patient_id}`,
    {
      method: "POST",
      // body: JSON.stringify({ specialization, patient_record }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const genSummary = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { specialization } = await getUserFromRedis(req.auth.payload.sub);
    console.log(specialization);
    // Get medical record from database
    const patient_record = await MedicalRecord.findOne({ patient_id });

    if (!patient_record) {
      throw new NotFoundError(
        `Medical record does not exist for patient ${patient_id}`,
        { patient_id }
      );
    }

    // Send request to AI service
    const summary = await aiSummary(
      patient_id,
      specialization,
      patient_record
    ).then((res) => res.json());

    return sendSuccess(res, { summary }, "Summary generated successfully");
  } catch (error) {
    return sendError(res, error);
  }
};
