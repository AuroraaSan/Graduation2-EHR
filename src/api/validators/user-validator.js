import Joi from 'joi';
import joi_phone_number from 'joi-phone-number';
const joi = Joi.extend(joi_phone_number);

export function patientRegister(body) {
  const schema = joi.object({
    email: joi.string().email().min(3).required(),
    full_name: joi.string().min(3).max(24).required(),
    password: joi.string().min(6).max(20).required(),
    gender: joi.string().valid('male', 'female').required(),
    birth_date: joi.date().required(),
    address: joi.string().required(),
    national_id: joi.string().length(14).required(),
    photo_url: joi.string().uri(),
    insurance_number: joi.string(),
    phone_number: joi.string().phoneNumber({ defaultCountry: 'EG' }),
    role: joi.string().valid('patient').required()
  });
  return schema.validate(body);
}

export function emergencyContactInfo(body) {
  const schema = joi.object({
    contact_name: joi.string().min(3).max(24).required(),
    email: joi.string().email().min(3).required(),
    gender: joi.string().valid('male', 'female').required(),
    address: joi.string().required(),
    national_id: joi.string().length(14).required(),
    relation_to_patient: joi.string().required(),
    phone_number: joi.string().phoneNumber({ defaultCountry: 'EG' }),
  });
  return schema.validate(body);
}

export function doctorRegister(body) {
  const schema = joi.object({
    email: joi.string().email().min(3).required(),
    full_name: joi.string().min(3).max(24).required(),
    password: joi.string().min(6).max(20).required(),
    gender: joi.string().valid('male', 'female').required(),
    birth_date: joi.date().required(),
    address: joi.string().required(),
    national_id: joi.string().length(14).required(),
    photo_url: joi.string().uri(),
    specialization: joi.string().required(),
    license_number: joi.string().required(),
    years_of_experience: joi.number().required(),
    phone_number: joi.string().phoneNumber({ defaultCountry: 'EG' }).required(),
    educational_background: joi.string().required(),
    hospital_affiliations: joi.string().required(),
    hospital_id: joi.string().required(),
    role: joi.string().valid('doctor').required()
  });
  return schema.validate(body);
}

export function adminRegister(body) {
  const schema = joi.object({
    email: joi.string().email().min(3).required(),
    full_name: joi.string().min(3).max(24).required(),
    password: joi.string().min(6).max(20).required(),
    national_id: joi.string().length(14).required(),
    phone_number: joi.string().phoneNumber({ defaultCountry: 'EG' }),
    hospital_id: joi.string().required(),
    role: joi.string().valid('admin').required()
  });
  return schema.validate(body);
}

export function patientLogin(body) {
  const schema = joi.object({
    email: joi.string().email().min(3).required(),
    password: joi.string().min(6).max(20).required(),
    role: joi.string().valid('patient').required()
  });
  return schema.validate(body);
}

export function doctorLogin(body) {
  const schema = joi.object({
    email: joi.string().email().min(3).required(),
    password: joi.string().min(6).max(20).required(),
    role: joi.string().valid('doctor').required()
  });
  return schema.validate(body);
}

export function adminLogin(body) {
  const schema = joi.object({
    email: joi.string().email().min(3).required(),
    password: joi.string().min(6).max(20).required(),
    role: joi.string().valid('admin').required()
  });
  return schema.validate(body);
}

export function sendVerificationCode(body) {
  const schema = joi.object({
    email: joi.string().email().min(3).required()
  });
  return schema.validate(body);
}

export function verifyEmail(body) {
  const schema = joi.object({
    token: joi.string().min(10).required(),
    code: joi.string().length(4).required()
  });
  return schema.validate(body);
}

export function refreshToken(body) {
  const schema = joi.object({
    refreshToken: joi.string().min(10).required()
  });
  return schema.validate(body);
}

export function forgotPassword(body) {
  const schema = joi.object({
    email: joi.string().min(3).required()
  });
  return schema.validate(body);
}

export function changePassword(body) {
  const schema = joi.object({
    currPassword: joi.string().min(6).max(20).required(),
    newPassword: joi.string().min(6).max(20).required(),
    retypeNewPassword: joi.string().min(6).max(20).required()
  });
  return schema.validate(body);
}

export function resetPassword(body) {
  const schema = joi.object({
    newPassword: joi.string().min(6).max(20).required(),
    retypeNewPassword: joi.string().min(6).max(20).required()
  });
  return schema.validate(body);
}

export function editPatient(body) {
  const schema = joi.object({
    email: joi.string().email().min(3),
    full_name: joi.string().min(3).max(24),
    birth_date: joi.date(),
    address: joi.string(),
    photo_url: joi.string().uri(),
    insurance_number: joi.string(),
    phone_number: joi.string().phoneNumber({ defaultCountry: 'EG' })
  });
  return schema.validate(body);
}

export function editDoctor(body) {
  const schema = joi.object({
    email: joi.string().email().min(3),
    full_name: joi.string().min(3).max(24),
    birth_date: joi.date(),
    address: joi.string(),
    photo_url: joi.string().uri(),
    years_of_experience: joi.string(),
    phone_number: joi.string().phoneNumber({ defaultCountry: 'EG' }),
    hospital_affiliations: joi.string()
  });
  return schema.validate(body);
}

export function createAdmission(body) {
  const schema = joi.object({
    patient_id: joi.string().required(),
    doctor_id: joi.string().required(),
    discharge_date: joi.date(),
  });
  return schema.validate(body);
}