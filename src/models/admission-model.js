import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/postgres-loader.js';

class Admission extends Model {}

Admission.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        patient_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'patients',
                key: 'id',
            },
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        doctor_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'doctors',
                key: 'id',
            },
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        admin_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'admins',
                key: 'id',
            },
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        hospital_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'hospitals',
                key: 'id',
            },
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        discharge_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Admission',
        tableName: 'admissions',
        timestamps: true,
        underscored: true,
    }
)

export default Admission;