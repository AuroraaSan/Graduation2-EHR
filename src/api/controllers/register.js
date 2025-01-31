import { default as sequelize } from '../../loaders/postgres-loader.js';
import * as utils from '../../utils/utils-index.js';
import { Doctor, Patient, Contact, PatientContact } from '../../models/models-index.js';
import * as validate from '../validators/user-validator.js';
import { createMedicalRecord } from '../../interfaces/patient/create-medical-record.js';
import Admin from '../../models/admin-model.js';
import { redisClient } from '../../loaders/redis-loader.js';

export const register = async (req, res) => {
  let transaction;
  try {
    const transaction = await sequelize.transaction();
    // Validate user input
    let error, user_error, contact_error;
    const { user: req_user, contact: req_contact } = req.body;

    // console.log(req_user);
    if (req_user.role == "patient") {
      ({ error: user_error } = validate.patientRegister(req_user));
      ({ error: contact_error } = validate.emergencyContactInfo(req_contact));
    } else if (req_user.role == "doctor") {
        ({ error } = validate.doctorRegister(req_user)); 
    } else if (req_user.role == "admin") {
        ({ error } = validate.adminRegister(req_user));
    }

    if (error) throw new utils.ValidationError(error.details[0].message);
    if (user_error) throw new utils.ValidationError(user_error.details[0].message);
    if (contact_error) throw new utils.ValidationError(contact_error.details[0].message);

    // Check if user already exists by email
    let exists;
    switch (req_user.role) {
      case 'doctor':
        exists = await Doctor.findOne({ where: { email: req_user.email } });
        break;
      case 'patient':
        exists = await Patient.findOne({ where: { email: req_user.email } });
        break;
      case 'admin':
        exists = await Admin.findOne({ where: { email: req_user.email } });
        break;
      default:
      throw new utils.ValidationError('Invalid user role');
    }
    if (exists) throw new utils.ConflictError('User with this email already exists');

    // Create user in Auth0
    const auth0User = await utils.auth0Management.users.create({
      email: req_user.email,
      password: req_user.password, // Auth0 handles password hashing
      connection: 'Username-Password-Authentication',
    });

    // Assign role to the user
    
    let roleId;
    switch (req_user.role) {
      case 'doctor':
        roleId = 'rol_nbukgm8to015vJ7W';
        break;
      case 'patient':
        roleId = 'rol_3YiZALY75IduFkBo';
        break;
      case 'admin':
        roleId = 'rol_DpBYYvubDf67wbsc';
        break;
      default:
      throw new utils.ValidationError('Invalid user role');
    }
    await utils.auth0Management.users.assignRoles({ id: auth0User.data.user_id }, { roles: [roleId] });

    // Create user in your database (without password)
    let user;

    if (req_user.role === 'doctor') {
      user = await Doctor.create({
        id: auth0User.data.user_id,
        email: req_user.email,
        full_name: req_user.full_name,
        role: 'doctor',
        gender: req_user.gender,
        birth_date: req_user.birth_date,
        address: req_user.address,
        national_id: req_user.national_id,
        photo_url: req_user.photo_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png',
        is_verified: false,
        specialization: req_user.specialization,
        license_number: req_user.license_number,
        years_of_experience: req_user.years_of_experience,
        phone_number: req_user.phone_number,
        educational_background: req_user.educational_background,
        hospital_affiliations: req_user.hospital_affiliations,
        hospital_id: req_user.hospital_id,
      },
      { transaction }
    );
    } else if (req_user.role === 'patient'){
      // Create patient user
      user = await Patient.create({
        id: auth0User.data.user_id,
        email: req_user.email,
        full_name: req_user.full_name,
        role: 'patient',
        gender: req_user.gender,
        birth_date: req_user.birth_date,
        address: req_user.address,
        national_id: req_user.national_id,
        photo_url: req_user.photo_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png',
        insurance_number: req_user.insurance_number,
        phone_number: req_user.phone_number,
      },
      { transaction }
      );

      // Create emergency contact
      const contact = await Contact.create({
        contact_name: req_contact.contact_name,
        email: req_contact.email,
        gender: req_contact.gender,
        relation_to_patient: req_contact.relation_to_patient,
        address: req_contact.address,
        national_id: req_contact.national_id,
        phone_number: req_contact.phone_number,
      },
      { transaction }
      );

      // Create patient contact relationship
      await PatientContact.create({  
        patient_id: user.id,
        contact_id: contact.id,
        is_emergency_contact: true,
      },
      { transaction }
      );
    } else if (req_user.role === 'admin') {
      user = await Admin.create({
        id: auth0User.data.user_id,
        email: req_user.email,
        full_name: req_user.full_name,
        role: 'admin',
        national_id: req_user.national_id,
        phone_number: req_user.phone_number,
        hospital_id: req_user.hospital_id,
      },
      { transaction }
      );
    }

    // const recordCreationSuccessful = await createMedicalRecord({ patient_id: user.id, blood_type: "AB+", weight: 76, height: 176 });

    // if (!recordCreationSuccessful) {
    //   console.log('Error creating medical record');
    // }

    await redisClient.hSet(`user:${user.id}`, {
      user: JSON.stringify(user),
      // id_token: auth0Response.id_token,
    });

    // Commit the transaction
    await transaction.commit();

    
    // Send success response
    return utils.sendSuccess(res, 'You registered successfully.', { user });
  } catch (error) {

    console.error('Error in register controller:', error);
    // Rollback the transaction
    await transaction.rollback();

    await utils.auth0Management.users.delete({ id: auth0User.data.user_id });
    // Delete user from Auth0 if user creation fails
    // if (error.name === 'Auth0Error' && auth0User?.data?.user_id) {
      
    // }
    return utils.sendError(res, error);
  }
};


/**
 * @swagger
 * /patient/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided details and sends a verification code to the user's email.
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: user@example.com
 *                     description: The user's unique email.
 *                   full_name:
 *                     type: string
 *                     example: John Doe
 *                     description: The user's full name.
 *                   password:
 *                     type: string
 *                     format: password
 *                     example: StrongPassword123
 *                     description: The user's password.
 *                   role:
 *                     type: string
 *                     example: patient
 *                     description: The user's role in the system.
 *                   gender:
 *                     type: string
 *                     example: male
 *                     description: The user's gender.
 *                   birth_date:
 *                     type: string
 *                     format: date
 *                     example: 1990-01-01
 *                     description: The user's birth date.
 *                   address:
 *                     type: string
 *                     example: 123 Main St, Anytown, USA
 *                     description: The user's address.
 *                   national_id:
 *                     type: string
 *                     example: A12345678
 *                     description: The user's national ID.
 *                   photo_url:
 *                     type: string
 *                     format: uri
 *                     example: https://example.com/photo.jpg
 *                     description: URL to the user's profile photo.
 *                   insurance_number:
 *                     type: string
 *                     example: "INS123"
 *                   phone_number:
 *                     type: string
 *                     example: "+201234567890"
 *               contact:
 *                 type: object
 *                 properties:
 *                   contact_name:
 *                     type: string
 *                     example: Jane Doe
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: jane@examplecom
 *                   gender:
 *                     type: string
 *                     example: female
 *                   relation_to_patient:
 *                     type: string
 *                     example: mother
 *                   address:
 *                     type: string
 *                     example: 456 Elm St, Anytown, USA
 *                   national_id:
 *                     type: string
 *                     example: B12345678
 *                   phone_number:
 *                     type: string
 *                     example: "+201234567890"
 *     responses:
 *       200:
 *         description: Successfully registered the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: You registered successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "PT1234"
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         full_name:
 *                           type: string
 *                           example: John Doe
 *                         gender:
 *                           type: string
 *                           example: male
 *                         birth_date:
 *                           type: string
 *                           example: 1990-01-01
 *                         address:
 *                           type: string
 *                           example: 123 Main St, Anytown, USA
 *                         national_id:
 *                           type: string
 *                           example: A12345678
 *                         photo_url:
 *                           type: string
 *                           example: https://example.com/photo.jpg
 *                         is_verified:
 *                           type: boolean
 *                           example: false
 *                         phone_number:
 *                           type: string
 *                           example: "+201234567890"
 *                         insurance_number:
 *                           type: string
 *                           example: "INS123"
 *       400:
 *         description: Validation error in request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation error in request data.
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Email is required.", "Password must be at least 8 characters."]
 *       409:
 *         description: Conflict error, such as when a user with the given email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: A user with this email already exists.
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred. Please try again later.
*/