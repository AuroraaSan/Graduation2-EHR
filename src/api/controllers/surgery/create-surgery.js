import { Surgery, MedicalRecord } from '../../../models/models-index.js';
import { sendSuccess, sendError } from '../../../utils/response-handler.js';
import { createAuditLog } from '../../../utils/audit-logger.js';
import { NotFoundError, ValidationError } from '../../../utils/errors.js';
import { validate } from '../../validators/validator.js';
import { createSurgerySchema } from '../../validators/schemas/index.js';

export const createSurgery = async (req, res) => {
  const {
    medical_record_id,
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
    
    validate(createSurgerySchema);
    const doctor_id = req.body?.doctor_id;
    if (!doctor_id) {
      throw new ValidationError('Doctor ID not provided', { field: 'doctor_id' });
    }

    // Verify medical record exists
    const medicalRecord = await MedicalRecord.findById(medical_record_id);
    if (!medicalRecord) {
      throw new NotFoundError('Medical Record', medical_record_id);
    }

    const surgery = new Surgery({
      medical_record_id,
      type,
      procedure_date,
      hospital,
      primary_surgeon_id: doctor_id,
      assistant_surgeon_ids,
      anesthesiologist_id,
      pre_op_diagnosis,
      estimated_blood_loss,
      duration,
      post_op_instructions,
      follow_up_date,
      emergency,
      images,
      status: 'Scheduled',
    });

    const savedSurgery = await surgery.save();

    // Update medical record with the new surgery
    await MedicalRecord.findByIdAndUpdate(
      medical_record_id,
      { $push: { surgeries: savedSurgery._id } }
    );

    await createAuditLog({
      medical_record_id,
      collection_name: 'surgeries',
      document_id: savedSurgery._id,
      action: 'CREATE',
      changes: {
        after: savedSurgery.toObject(),
      },
      doctor_id,
      reason: `New surgery scheduled: ${type}`,
      access_type: emergency ? 'Emergency' : 'Regular',
      req,
    });

    return sendSuccess(res, savedSurgery, 'Surgery scheduled successfully', 201);
  };
