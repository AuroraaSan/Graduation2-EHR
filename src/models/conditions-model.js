import mongoose from 'mongoose';

const { Schema } = mongoose;

const conditionSchema = new Schema({
  medical_record_id: {
    type: Schema.Types.ObjectId,
    ref: 'MedicalRecord',
    required: true,
  },
  patient_id: {
    type: String, // External ID from PostgreSQL
    require: true,
  },
  condition_name: {
    type: String,
    required: true,
  },
  diagnosis_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Remission'],
    required: true,
  },
  notes: String,
  treated: {
    type: Boolean,
    default: false,
  },
  diagnosing_doctor_id: {
    type: String, // External ID from PostgreSQL
    required: true,
  },
  severity: {
    type: String,
    enum: ['Mild', 'Moderate', 'Severe'],
    required: true,
  },
  last_assessment_date: Date,
  expected_duration: String,
  treatment_plan: String,
  related_conditions: [{
    type: Schema.Types.ObjectId,
    ref: 'Condition',
  }],
}, {
  timestamps: true,
  versionKey: 'version',
});

// Indexes
conditionSchema.index({ medical_record_id: 1 });
conditionSchema.index({ diagnosing_doctor_id: 1 });
conditionSchema.index({ status: 1 });
conditionSchema.index({ diagnosis_date: 1 });
conditionSchema.index({ createdAt: 1 });

const Condition = mongoose.model('Condition', conditionSchema);
export default Condition;

/*
-- Allergies

-- Medical conditions
    . Conditions
        _ diagnosis
        _ dateDiagnosed
        _ description
        _ severity
    . Surgeries
        _ procedure
        _ dateProcedure
    . Medications
        _ name
        _ PrescriptionDate
        _ Dosage

-- Treatment Plan
    . Treatment
        _ Condition
        _ startDate
        _ endDate
        _ details
*/
