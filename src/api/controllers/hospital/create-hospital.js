import Hospital from '../../../models/hospital-model.js';
import * as validate from '../../validators/hospital-validator.js';
import * as utils from '../../../utils/utils-index.js';
import { v4 as uuidv4 } from 'uuid';

export default async (req, res) => {
    try {
        const { error } = validate.createHospital(req.body);
        if (error) throw new utils.ValidationError();

        const { name, address, phone_number, email } = req.body;

        const hospital = await Hospital.create({
            // id: uuidv4(),
            name,
            address,
            email,
            phone_number
        });

        return utils.sendSuccess(res, hospital, 201);
    } catch (error) {
        console.error('Error in create-hospital controller:', error);
        res.status(400).send(error);
    }
}