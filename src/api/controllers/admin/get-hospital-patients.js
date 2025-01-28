import { Admin, Admission, Patient } from "../../../models/models-index.js";
import { sendError } from "../../../utils/response-handler.js";

export default async (req, res) => {
    try {
        const adminId = req.auth.payload.sub;

        const admin = await Admin.findByPk(adminId);


        const { page = 1, limit = 10 } = req.query;

        const patientIds = await Admission.findAll({
            where: {
                hospital_id: admin.hospital_id,
                discharge_date: null,
            },
            attributes: ['patient_id'],
            raw: true,
        }).then(admissions => admissions.map(admission => admission.patient_id));
        
        const patients = await Patient.findAll({
            where: {
                id: patientIds,
            },
            attributes: ['id', 'full_name', 'email', 'phone_number'],
        });
        
        res.status(200).send({
            totalPages: Math.ceil(patients.length / limit),
            currentPage: page,
            patients
        });

    } catch (error) {
        return sendError(res, error);
    }
}