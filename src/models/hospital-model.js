import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/postgres-loader.js';

class Hospital extends Model {}

Hospital.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            autoIncrement: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        photo_url: {
            type: DataTypes.STRING,
            defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png',
        },
    },
    {
        sequelize,
        modelName: 'Hospital',
        tableName: 'hospitals',
        timestamps: true,
        underscored: true,
    }
);

export default Hospital;