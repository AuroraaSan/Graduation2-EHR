import { Admission, Patient } from "../../../models/models-index.js";
import { sendError } from "../../../utils/utils-index.js";

export default async (req, res) => {
    try {
        const doctorId = req.auth.payload.sub;

        const patientIds = await Admission.findAll({
            where: {
                doctor_id: doctorId,
                discharge_date: null,
            },
            attributes: ['patient_id'],
            raw: true,
        }).then(admissions => admissions.map(admission => admission.patient_id));

        const patients = await Patient.findAll({
            where: {
                id: patientIds,
            },
            attributes: ['national_id', 'full_name', 'email', 'phone_number'],
        });

        res.status(200).send({
            patients
        });
    } catch (error) {
        return sendError(res, error);
    }
}