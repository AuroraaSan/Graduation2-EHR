import mongoose from "mongoose";

const { Schema } = mongoose;

const vitalSchema = new Schema({
  heart_rate: Number,
  blood_pressure: String,
  temperature: String,
  oxygen_saturation: Number,
  respiratory_rate: Number,
  blood_glucose: Number,
  pain_level: {
    type: Number,
    min: 0,
    max: 10,
  },
  bmi: Number,
  other: Schema.Types.Mixed,
});

const visitSchema = new Schema(
  {
    medical_record_id: {
      type: Schema.Types.ObjectId,
      ref: "MedicalRecord",
      required: true,
    },
    patient_id: {
      type: String,
      required: true,
    },
    doctor_id: {
      type: String, // External ID from PostgreSQL
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    visit_type: {
      type: String,
      enum: [
        "Regular",
        "Emergency",
        "Follow-up",
        "Consultation",
        "Telemedicine",
      ],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    complaint: String,
    symptoms: [String],
    diagnosis: [String],
    treatment_plan: String,
    medications_prescribed: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medication",
      },
    ],
    referrals: [
      {
        specialty: String,
        doctor_id: String, // External ID from PostgreSQL
        reason: String,
        priority: {
          type: String,
          enum: ["Routine", "Urgent", "Emergency"],
        },
      },
    ],
    lab_orders: [
      {
        type: Object,
        test_name: String,
        status: {
          type: String,
          enum: ["Ordered", "Completed", "Cancelled"],
        },
        results: Schema.Types.Mixed,
        ordered_date: Date,
        completed_date: Date,
      },
    ],
    imaging_orders: [
      {
        type: Object,
        status: {
          type: String,
          enum: ["Ordered", "Completed", "Cancelled"],
        },
        results: Schema.Types.Mixed,
        ordered_date: Date,
        completed_date: Date,
      },
    ],
    notes: String,
    facility: String,
    vitals: vitalSchema,
    duration: Number, // in minutes
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled", "No Show"],
      default: "Scheduled",
    },
    billing_status: {
      type: String,
      enum: ["Pending", "Billed", "Paid", "Denied"],
      default: "Pending",
    },
    report_ref: String,
    follow_up_needed: Boolean,
    follow_up_date: Date,
  },
  {
    timestamps: true,
    versionKey: "version",
  }
);

// Indexes
visitSchema.index({ medical_record_id: 1 });
visitSchema.index({ doctor_id: 1 });
visitSchema.index({ date: 1 });
visitSchema.index({ status: 1 });
visitSchema.index({ visit_type: 1 });
visitSchema.index({ createdAt: 1 });

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
