import Token from './token-model.js';
import Log from './log-model.js';
import Doctor from './doctor-model.js';
import Patient from './patient-model.js';
import Contact from './emergency-contact-model.js';
import PatientContact from './patient-contact-model.js';
import Hospital from './hospital-model.js';
import Admin from './admin-model.js';
import HospitalDoctor from './hospital-doctor-model.js';
import Admission from './admission-model.js';

// Define many-to-many relationship
Patient.belongsToMany(Contact, { through: PatientContact, foreignKey: 'patient_id' });
Contact.belongsToMany(Patient, { through: PatientContact, foreignKey: 'contact_id' });

Hospital.belongsToMany(Doctor, { through: HospitalDoctor, foreignKey: 'hospital_id' });
Doctor.belongsToMany(Hospital, { through: HospitalDoctor, foreignKey: 'doctor_id' });

// Define one-to-many relationship
Hospital.hasMany(Admin, { foreignKey: 'id' });

export { Patient, Doctor, Token, Contact, PatientContact, Log, Admin, Admission, Hospital };