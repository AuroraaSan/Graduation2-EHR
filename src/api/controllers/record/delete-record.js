import { MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import {
  NotFoundError,
} from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { deleteRecordSchema } from '../../validators/schemas/index.js';

export const deleteRecord = async (req, res) => {
    validate(deleteRecordSchema);
    const { id: patient_id } = req.params;

    const record = await MedicalRecord.findOne({ patient_id }, { _id: 1 }).lean();
    if (!record) {
      throw new NotFoundError(
        `Medical record does not exist for patient ${patient_id}`,
        { patient_id }
      );
    }

    await MedicalRecord.deleteOne({ patient_id });

    // Save a new audit log to track actions in the system
    await createAuditLog({
      medical_record_id: record._id,
      collection_name: 'medical_records',
      document_id: record._id,
      action: 'DELETE',
      changes: {
        after: null,
      },
      reason: 'Medical Record Viewed',
      req,
    });

    return sendSuccess(res, null, 'Medical record deleted successfully', 204);
  }
