import { Visit, MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, asyncHandler, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import { ForbiddenError, NotFoundError } from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { createVisitSchema } from '../../validators/schemas/index.js';
import { VerifyAdmissionStatus } from '../../../utils/redis-fetch.js';

export const createVisit = async (req, res) => {
  try {
    validate(createVisitSchema);
    const {
      patient_id,
      date,
      visit_type,
      reason,
      complaint,
      symptoms,
      diagnosis,
      treatment_plan,
      medications_prescribed,
      referrals,
      lab_orders,
      imaging_orders,
      facility,
      vitals,
      duration,
      follow_up_needed,
      follow_up_date,
    } = req.body;

    const doctor_id = req.auth.payload.sub;

    if (await VerifyAdmissionStatus(patient_id, doctor_id) === false) {
      throw new ForbiddenError('Doctor is not assigned to this patient');
    }

    // Verify medical record exists
    const medicalRecord = await MedicalRecord.findOne({ patient_id }, { _id: 1 }).lean();
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record', medicalRecord);
    }

    const medical_record_id = medicalRecord._id;

    const visit = new Visit({
      patient_id,
      medical_record_id,
      doctor_id,
      date,
      visit_type,
      reason,
      complaint,
      symptoms,
      diagnosis,
      treatment_plan,
      medications_prescribed,
      referrals,
      lab_orders,
      imaging_orders,
      facility,
      vitals,
      duration,
      follow_up_needed,
      follow_up_date,
      status: 'Completed',
    });

    const savedVisit = await visit.save();

    // Update medical record with the new visit
    await MedicalRecord.findByIdAndUpdate(
      medical_record_id,
      { $push: { visits: savedVisit._id } }
    );

    await createAuditLog({
      medical_record_id,
      collection_name: 'visits',
      document_id: savedVisit._id,
      action: 'CREATE',
      changes: {
        after: savedVisit.toObject(),
      },
      doctor_id,
      reason: `New visit recorded: ${visit_type} - ${reason}`,
      access_type: visit_type === 'Emergency' ? 'Emergency' : 'Regular',
      req,
    });

    return sendSuccess(res, savedVisit, 'Visit recorded successfully', 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export default asyncHandler(createVisit);
