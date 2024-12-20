import Joi from 'joi';

export const createMedicationSchema = {
  body: {
    medical_record_id: Joi.string().required(),
    medication_name: Joi.string().required(),
    dosage: Joi.string().required(),
    frequency: Joi.string().required(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')),
    condition: Joi.string(),
    route_of_administration: Joi.string().required().valid(
      'Oral',
      'Intravenous',
      'Intramuscular',
      'Subcutaneous',
      'Topical',
      'Inhalation',
      'Other'
    ),
    side_effects: Joi.array().items(Joi.string()),
    contraindications: Joi.array().items(Joi.string()),
    refills_remaining: Joi.number().min(0),
    pharmacy_notes: Joi.string(),
    prescription_id: Joi.string()
  }
}

