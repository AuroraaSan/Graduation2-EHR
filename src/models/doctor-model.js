import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/postgres-loader.js';

class Doctor extends Model {}

Doctor.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    national_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    photo_url: {
      type: DataTypes.STRING,
      defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png',
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    license_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    years_of_experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    educational_background: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hospital_affiliations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hospital_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'hospitals',
        key: 'id',
      },
      onDelete: 'CASCADE',
    }
  },
  {
    sequelize,
    modelName: 'Doctor',
    tableName: 'doctors',
    timestamps: true,
    underscored: true,
  }
);

export default Doctor;

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - full_name
 *         - password
 *         - birth_date
 *         - address
 *         - national_id
 *         - specialization
 *         - license_number
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the doctor.
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the doctor.
 *         full_name:
 *           type: string
 *           description: Full name of the doctor.
 *         password:
 *           type: string
 *           format: password
 *           description: Password for the doctor account.
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           description: Gender of the doctor.
 *         birth_date:
 *           type: string
 *           format: date
 *           description: Birth date of the doctor.
 *         address:
 *           type: string
 *           description: Residential address of the doctor.
 *         national_id:
 *           type: string
 *           description: National identification number of the doctor.
 *         photo_url:
 *           type: string
 *           format: uri
 *           description: URL to the doctor’s profile photo.
 *         is_verified:
 *           type: boolean
 *           default: false
 *           description: Indicates whether the doctor’s email is verified.
 *         specialization:
 *           type: string
 *           description: Medical specialization of the doctor.
 *         license_number:
 *           type: string
 *           description: Medical license number of the doctor.
 *         years_of_experience:
 *           type: integer
 *           description: Number of years of experience (optional).
 *         phone_number:
 *           type: string
 *           description: Contact phone number of the doctor (optional).
 *         educational_background:
 *           type: string
 *           description: Educational qualifications of the doctor (optional).
 *         hospital_affiliations:
 *           type: string
 *           description: Hospital affiliations of the doctor (optional).
 */