import mongoose from 'mongoose';

const { Schema } = mongoose;

const medicationSchema = new Schema({
  medical_record_id: {
    type: Schema.Types.ObjectId,
    ref: 'MedicalRecord',
    required: true,
  },
  patient_id: {
    type: String, // External ID from PostgreSQL
    required: true,
  },
  medication_name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: Date,
  prescribing_doctor_id: {
    type: String, // External ID from PostgreSQL
    required: true,
  },
  condition: {
    type: Schema.Types.ObjectId,
    ref: 'Condition',
  },
  route_of_administration: {
    type: String,
    required: true,
  },
  side_effects: [String],
  contraindications: [String],
  refills_remaining: Number,
  pharmacy_notes: String,
  prescription_id: String,
  status: {
    type: String,
    enum: ['Active', 'Discontinued', 'Completed'],
    default: 'Active',
  },
  discontinuation_reason: String,
  last_refill_date: Date,
  next_refill_date: Date,
}, {
  timestamps: true,
  versionKey: 'version',
});

// Indexes
medicationSchema.index({ medical_record_id: 1 });
medicationSchema.index({ prescribing_doctor_id: 1 });
medicationSchema.index({ status: 1 });
medicationSchema.index({ start_date: 1 });
medicationSchema.index({ end_date: 1 });
medicationSchema.index({ createdAt: 1 });

const Medication = mongoose.model('Medication', medicationSchema);
export default Medication;
