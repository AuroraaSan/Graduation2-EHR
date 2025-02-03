import * as validate from '../../validators/user-validator.js';
import { Patient, Doctor, Admin, Admission} from '../../../models/models-index.js';
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "../../../utils/error-handler.js";
import { sendError } from "../../../utils/response-handler.js";
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../../../loaders/redis-loader.js';

export default async (req, res) => {
    try {
        const { error } = validate.createAdmissionByNationalId(req.body);
        if (error) throw new ValidationError('Email not provided.');
        const { national_id, doctor_id } = req.body;
        const adminId = req.auth.payload.sub;

        const patient = await Patient.findOne({
            where: {
            national_id
            },
            raw: true
        });

        const doctor = await Doctor.findByPk(doctor_id, {
            attributes: ['hospital_id']
        });

        const admin = await Admin.findByPk(adminId, {
            attributes: ['hospital_id']
        });

        if (!patient) throw new NotFoundError('Patient not found');
        if (!doctor) throw new NotFoundError('Doctor not found');

        if (admin.hospital_id !== doctor.hospital_id) throw new ForbiddenError();

        // check if the patient is already admitted in the hospital with the same doctor
        const oldAdmission = await Admission.findOne({
            where: {
                patient_id: patient.id,
                doctor_id,
                hospital_id: doctor.hospital_id,
                discharge_date: null,
            }
        });

        if (oldAdmission) throw new ConflictError('Patient is already admitted');

        console.log('patient', patient);
        const admission = await Admission.create({
            id: uuidv4(),
            patient_id: patient.id,
            doctor_id,
            admin_id: adminId,
            hospital_id: doctor.hospital_id,
            discharge_date: null,
        });

        await redisClient.sAdd('admissions', `admission:${patient.id}:${doctor_id}`);

        res.status(201).send(admission);
    } catch (error) {
        return sendError(res, error);
    }
}