import mongoose from 'mongoose';

const { Schema } = mongoose;

const auditLogSchema = new Schema({
  collection_name: {
    type: String,
    enum: ['medical_records', 'conditions', 'medications', 'surgeries', 'visits', 'allergies', 'lifestyle'],
    required: true,
  },
  document_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'VIEW'],
    required: true,
  },
  changes: {
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
  },
  doctor_id: {
    type: String, // External ID from PostgreSQL
    required: true,
  },
  ip_address: String,
  user_agent: String,
  reason: {
    type: String,
    required: true,
  },
  access_type: {
    type: String,
    enum: ['Regular', 'Emergency', 'Administrative'],
    default: 'Regular',
  },
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Denied'],
    required: true,
  },
  failure_reason: String,
  metadata: Schema.Types.Mixed,
}, {
  timestamps: true,
  versionKey: 'version',
});

// Indexes
auditLogSchema.index({ medical_record_id: 1 });
auditLogSchema.index({ doctor_id: 1 });
auditLogSchema.index({ collection_name: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ status: 1 });
auditLogSchema.index({ createdAt: 1 });
auditLogSchema.index({ 'changes.field_name': 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
