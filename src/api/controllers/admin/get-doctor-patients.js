import Admin from "../../../models/admin-model.js";
import Admission from "../../../models/admission-model.js";
import Patient from "../../../models/patient-model.js";
import { sendError } from "../../../utils/response-handler.js";

export default async (req, res) => {
    try {
        const adminId = req.auth.payload.sub;
        const doctorId = req.params.id;

        const admin = await Admin.findByPk(adminId, {
            attributes: ['hospital_id']
        });

        const patientIds = await Admission.findAll({
            where: {
                doctor_id: doctorId,
                discharge_date: null,
                hospital_id: admin.hospital_id
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

        res.status(200).send(patients);

    } catch (error) {
        return sendError(res, error);
    }
};