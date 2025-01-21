import Joi from 'joi';
import joi_phone_number from 'joi-phone-number';
const joi = Joi.extend(joi_phone_number);

export function createHospital(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().min(3).required(),
        address: Joi.string().min(3).required(),
        phone_number: joi.string().phoneNumber({ defaultCountry: 'EG' }).required(),
        photo_url: Joi.string().uri(),
    });
    return schema.validate(body);
}