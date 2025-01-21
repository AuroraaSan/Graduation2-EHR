import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/postgres-loader.js';

class Admin extends Model {}

Admin.init(
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
        national_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone_number: {
            type: DataTypes.STRING,
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
        },
    },
    {
        sequelize,
        modelName: 'Admin',
        tableName: 'admins',
        timestamps: true,
        underscored: true,
    }
)

export default Admin;