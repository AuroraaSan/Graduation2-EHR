import { MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import {
  ForbiddenError,
  NotFoundError,
} from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { getRecordSchema } from '../../validators/schemas/index.js';

export const getRecord = async (req, res) => {
    validate(getRecordSchema);
    const { id: patient_id } = req.params;
    const { doctor_id } = req.body;

    if (!doctor_id) {
      throw new ForbiddenError('Doctor ID not provided');
    }
    console.log(patient_id);
    // const { role } = req;
    // const caller_id = req.user.id;

    // Check if medical record already exists
    const record = await MedicalRecord.findOne({ patient_id }).populate('medical_conditions').lean();
    console.log(record);
    if (!record) {
      throw new NotFoundError(
        `Medical record does not exist for patient ${patient_id}`,
        { patient_id }
      );
    }

    // need to check here if doctor is assigned to patient
    // if (role === 'patient') {
    //   if (record.patient_id !== caller_id) {
    //     throw new ForbiddenError();
    //   }
    // }

    // Save a new audit log to track actions in the system
    await createAuditLog({
      medical_record_id: record._id,
      collection_name: 'medical_records',
      document_id: record._id,
      action: 'VIEW',
      reason: 'Medical Record Viewed',
      req,
      doctor_id,
    });

    return sendSuccess(res, record);
  };