import mongoose from 'mongoose';

const { Schema } = mongoose;

const allergySchema = new Schema({
  medical_record_id: {
    type: Schema.Types.ObjectId,
    ref: 'MedicalRecord',
    required: true,
  },
  patient_id: {
    type: String, // External ID from PostgreSQL
    require: true,
  },
  allergen_name: {
    type: String,
    required: true,
  },
  allergen_type: {
    type: String,
    enum: ['Drug', 'Food', 'Environmental', 'Other'],
    required: true,
  },
  reaction: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['Mild', 'Moderate', 'Severe', 'Life-threatening'],
    required: true,
  },
  diagnosing_doctor_id: {
    type: String, // External ID from PostgreSQL
    required: true,
  },
  diagnosis_date: {
    type: Date,
    required: true,
  },
  onset_date: Date,
  last_occurrence: Date,
  treatment_plan: String,
  emergency_instructions: String,
  medications_to_avoid: [String],
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Resolved'],
    default: 'Active',
  },
  verification_status: {
    type: String,
    enum: ['Reported', 'Confirmed', 'Refuted'],
    default: 'Reported',
  },
  notes: String,
}, {
  timestamps: true,
  versionKey: 'version',
});

// Indexes
allergySchema.index({ medical_record_id: 1 });
allergySchema.index({ diagnosing_doctor_id: 1 });
allergySchema.index({ allergen_type: 1 });
allergySchema.index({ severity: 1 });
allergySchema.index({ status: 1 });
allergySchema.index({ createdAt: 1 });

const Allergy = mongoose.model('Allergy', allergySchema);
export default Allergy;
