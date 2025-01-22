import { DataTypes } from 'sequelize';
import sequelize from '../loaders/postgres-loader.js';

const HospitalDoctor = sequelize.define(
    'hospital_doctors',
    {
        hospital_id: {
        type: DataTypes.UUID,
        references: {
            model: 'hospitals',
            key: 'id',
        },
        primaryKey: true,
        onDelete: 'CASCADE',
        },
        doctor_id: {
        type: DataTypes.STRING,
        references: {
            model: 'doctors',
            key: 'id',
        },
        primaryKey: true,
        onDelete: 'CASCADE',
        },
    },
    {
        tableName: 'hospital_doctors',
        timestamps: false,
        underscored: true,
    }
)

export default HospitalDoctor;