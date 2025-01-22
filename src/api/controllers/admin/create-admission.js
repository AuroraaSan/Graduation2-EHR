import * as validate from '../../validators/user-validator.js';
import * as utils from '../../../utils/utils-index.js';
import { Patient, Doctor, Admin, Admission} from '../../../models/models-index.js';
import { v4 as uuidv4 } from 'uuid';

export default async (req, res) => {
    try {
        const { error } = validate.createAdmission(req.body);
        if (error) throw new utils.ValidationError('Email not provided.');

        const { patient_id, doctor_id, discharge_date } = req.body;
        const adminId = req.auth.payload.sub;

        const patient = await Patient.findByPk(patient_id, {
            attributes: ['id']
        });
        const doctor = await Doctor.findByPk(doctor_id, {
            attributes: ['hospital_id']
        });
        const admin = await Admin.findByPk(adminId, {
            attributes: ['hospital_id']
        });

        if (!patient) throw new utils.NotFoundError('Patient not found');
        if (!doctor) throw new utils.NotFoundError('Doctor not found');

        if (admin.hospital_id !== doctor.hospital_id) throw new utils.ForbiddenError();

        // check if the patient is already admitted in the hospital
        const oldAdmission = await Admission.findOne({
            where: {
                patient_id,
                hospital_id: doctor.hospital_id,
                discharge_date: null,
            }
        });

        if (oldAdmission) throw new utils.ConflictError('Patient is already admitted');

        const admission = await Admission.create({
            id: uuidv4(),
            patient_id,
            doctor_id,
            admin_id: adminId,
            hospital_id: doctor.hospital_id,
            discharge_date,
        });

        res.status(201).send(admission);
    } catch (error) {
        return utils.sendError(res, error);
    }
}