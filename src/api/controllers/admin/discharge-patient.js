import { redisClient } from "../../../loaders/redis-loader.js";
import Admin from "../../../models/admin-model.js";
import Admission from "../../../models/admission-model.js";
import * as utils from '../../../utils/utils-index.js';

export default async (req, res) => {
    try {
        const adminId = req.auth.payload.sub;
        const patientId = req.params.id;

        const admin = await Admin.findByPk(adminId, {
            attributes: ['hospital_id']
        });

        const admission = await Admission.findOne({
            where: {
                hospital_id: admin.hospital_id,
                patient_id: patientId,
                discharge_date: null
            }
        });

        if (!admission) {
            throw new utils.NotFoundError('No active admission found for patient');
        }

        admission.discharge_date = new Date();
        await admission.save();

        await redisClient.sRem('admissions', `admission:${patientId}:${admission.doctorId}`);

        res.status(200).send({
            message: 'Patient discharged successfully'
        });
    } catch (error) {
        return utils.sendError(res, error);
    }
};