const { DataTypes } = require('sequelize');
const { sequelize } = require("../db/dbConfig")
const Hospital = require('./hospitalModel');

const Patient = sequelize.define('Patient', {

    hospitalId: {
        type: DataTypes.INTEGER,
        references: {
            model: Hospital,
            key: 'id',
        },
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    disease: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admitDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dischargeDate: {
        type: DataTypes.DATE,
    }

});


Patient.belongsTo(Hospital, { foreignKey: 'hospitalId' });

module.exports = Patient;
