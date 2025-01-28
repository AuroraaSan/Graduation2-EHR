import Joi from 'joi';

export const createSurgerySchema = {
  body: {
    patient_id: Joi.string().required(),
    type: Joi.string().required(),
    procedure_date: Joi.date().iso().required(),
    hospital: Joi.string().required(),
    assistant_surgeon_ids: Joi.array().items(Joi.string()),
    anesthesiologist_id: Joi.string(),
    pre_op_diagnosis: Joi.string(),
    estimated_blood_loss: Joi.string(),
    duration: Joi.number().min(0), // in minutes
    post_op_instructions: Joi.string(),
    follow_up_date: Joi.date().iso().min(Joi.ref('procedure_date')),
    emergency: Joi.boolean().default(false),
    images: Joi.array().items(Joi.string().uri()),
  },
};
