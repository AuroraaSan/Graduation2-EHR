import Joi from 'joi';

export const createMedicationSchema = {
  body: {
    medication_name: Joi.string().required(),
    patient_id: Joi.string().required(),
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
    prescription_id: Joi.string(),
  },
};

export const updateMedicationSchema = {
  body: {
    medication_name: Joi.string(),
    dosage: Joi.string(),
    frequency: Joi.string(),
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')),
    condition: Joi.string(),
    route_of_administration: Joi.string().valid(
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
    prescription_id: Joi.string(),
  },
};
