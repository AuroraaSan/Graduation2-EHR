import { Admin, Admission, Doctor } from "../../../models/models-index.js";
import { UnauthorizedError } from "../../../utils/error-handler.js";
import { sendError } from "../../../utils/response-handler.js";

export default async (req, res) => {
    try {
        const adminId = req.auth.payload.sub;

        if (!adminId) {
            throw new UnauthorizedError('Admin ID not found in token');
        }
        const admin = await Admin.findByPk(adminId, {
            attributes: ['hospital_id']
        });

        const admissions = await Admission.findAll({
            where: {
                hospital_id: admin.hospital_id,
                discharge_date: null
            },
        });

        const admissionsWithDoctorNames = await Promise.all(admissions.map(async (admission) => {
            const doctor = await Doctor.findByPk(admission.doctor_id, {
                attributes: ['full_name']
            });
            return {
                ...admission.toJSON(),
                doctor_name: doctor.full_name
            };
        }));

        res.status(200).send(admissionsWithDoctorNames);
    } catch (error) {
        return sendError(res, error);
    }
};