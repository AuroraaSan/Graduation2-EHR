import { Admin, Doctor } from "../../../models/models-index.js";
import { sendError } from "../../../utils/response-handler.js";

export default async (req, res) => {
    try {
        const adminId = req.auth.payload.sub;

        const admin = await Admin.findByPk(adminId, {
            attributes: ['hospital_id']
        });

        const { page = 1, limit = 10 } = req.query;

        console.log("Admin ID: ", adminId);
        console.log("Admin: ", admin);
        const doctors = await Doctor.findAll({
            where: {
            hospital_id: admin.hospital_id
            },
            attributes: ['id', 'full_name', 'specialization', 'email'],
            offset: (page - 1) * limit,
            limit: parseInt(limit)
        });

        const totalDoctors = await Doctor.count({
            where: {
            hospital_id: admin.hospital_id
            }
        });

        res.status(200).send({
            totalPages: Math.ceil(totalDoctors / limit),
            currentPage: page,
            doctors
        });

    } catch (error) {
        return sendError(res, error);
    }
};