import { Admin, Admission } from "../../../models/models-index.js";
import { sendError } from "../../../utils/response-handler.js";

export default async (req, res) => {
    try {
        const adminId = req.auth.payload.sub;
        const admin = await Admin.findByPk(adminId, {
            attributes: ['hospital_id']
        });

        const admissions = await Admission.findAll({
            where: {
                hospital_id: admin.hospital_id,
                discharge_date: null
            },
        });

        res.status(200).send(admissions);
    } catch (error) {
        return sendError(res, error);
    }
};