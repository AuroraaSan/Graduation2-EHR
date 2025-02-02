import { AuditLog } from '../models/models-index.js';

export const createAuditLog = async ({
  collection_name,
  document_id,
  action,
  changes,
  doctor_id,
  reason,
  access_type = 'Regular',
  req,
}) => {
  try {
    const auditLog = new AuditLog({
      collection_name,
      document_id,
      action,
      changes,
      doctor_id,
      reason,
      access_type,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
      status: 'Success',
    });

    await auditLog.save();
  } catch (error) {
    console.error('Audit Log Creation Failed:', error);
    // No error will be thrown as audit log failure shouldn't affect the main operation
  }
};
