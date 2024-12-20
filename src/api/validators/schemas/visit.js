import Joi from 'joi';

export const createVisitSchema = {
  body: {
    medical_record_id: Joi.string().required(),
    date: Joi.date().iso().required().max('now'),
    visit_type: Joi.string().required().valid(
      'Regular',
      'Emergency',
      'Follow-up',
      'Consultation',
      'Telemedicine'
    ),
    reason: Joi.string().required(),
    complaint: Joi.string(),
    symptoms: Joi.array().items(Joi.string()),
    diagnosis: Joi.string(),
    treatment_plan: Joi.string(),
    medications_prescribed: Joi.array().items(Joi.string()),
    referrals: Joi.array().items(Joi.string()),
    lab_orders: Joi.array().items(Joi.string()),
    imaging_orders: Joi.array().items(Joi.string()),
    facility: Joi.string(),
    vitals: Joi.object({
      blood_pressure: Joi.string(),
      heart_rate: Joi.number(),
      respiratory_rate: Joi.number(),
      temperature: Joi.number(),
      oxygen_saturation: Joi.number(),
      weight: Joi.number()
    }),
    duration: Joi.number().min(0), // in minutes
    follow_up_needed: Joi.boolean().default(false),
    follow_up_date: Joi.date().iso().min(Joi.ref('date'))
  }
}
