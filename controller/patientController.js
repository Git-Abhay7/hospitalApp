const { Op, fn, literal, col } = require('sequelize');
const Patient = require('../model/patientModel');
const Hospital = require('../model/hospitalModel');

module.exports = {

    createPatient: async (req, res) => {
        try {
            const { hospitalId, name, age, gender, disease, admitDate, dischargeDate } = req.body;

            // Basic validation checks
            if (!hospitalId || !name || !age || !gender || !disease || !admitDate) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const hospitalExists = await Hospital.findByPk(hospitalId);
            if (!hospitalExists) {
                return res.status(400).json({ error: 'Invalid hospitalId' });
            }

            const patient = await Patient.create({
                hospitalId,
                name,
                age,
                gender,
                disease,
                admitDate,
                dischargeDate,
            });

            return res.status(201).json(patient);
        } catch (error) {
            console.error('Error creating patient:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    readPatients: async (req, res) => {
        try {
            const patients = await Patient.findAll();
            return res.status(200).json(patients);
        } catch (error) {
            console.error('Error fetching patients:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    readPatientById: async (req, res) => {
        try {
            const { id } = req.params;
            const patient = await Patient.findByPk(id);

            if (!patient) {
                return res.status(404).json({ error: 'Patient not found' });
            }

            return res.status(200).json(patient);
        } catch (error) {
            console.error('Error fetching patient:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    updatePatientById: async (req, res) => {
        try {
            const { id } = req.params;
            const { hospitalId, name, age, gender, disease, admitDate, dischargeDate } = req.body;

            if (hospitalId) {

                const hospitalExists = await Hospital.findByPk(hospitalId);
                if (!hospitalExists) {
                    return res.status(400).json({ error: 'Invalid hospitalId' });
                }
            }

            const patient = await Patient.findByPk(id);

            if (!patient) {
                return res.status(404).json({ error: 'Patient not found' });
            }

            await patient.update({
                hospitalId,
                name,
                age,
                gender,
                disease,
                admitDate,
                dischargeDate,
            });

            return res.status(200).json(patient);
        } catch (error) {
            console.error('Error updating patient:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    deletePatientById: async (req, res) => {
        try {
            const { id } = req.params;
            const patient = await Patient.findByPk(id);

            if (!patient) {
                return res.status(404).json({ error: 'Patient not found' });
            }

            await patient.destroy();

            return res.status(204).send({ message: "Success" });
        } catch (error) {
            console.error('Error deleting patient:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getPatientsByDate: async (req, res) => {
        try {
            const { date, type } = req.body;
            const datePart = date.split('T')[0];

            const whereCondition = type === 'admitted' ?
                { admitDate: { [Op.gte]: datePart, [Op.lt]: new Date(datePart + 'T23:59:59.999Z') } } :
                { dischargeDate: { [Op.gte]: datePart, [Op.lt]: new Date(datePart + 'T23:59:59.999Z') } };

            const patients = await Patient.findAll({
                where: whereCondition
            });

            return res.status(200).json({ count: patients.length, patients });
        } catch (error) {
            console.error('Error fetching patients by date:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getPatientsByDiseaseAndDate: async (req, res) => {
        try {
            const { disease, date } = req.body;

            const patients = await Patient.findAll({
                where: {
                    disease,
                    [Op.or]: [
                        { admitDate: { [Op.between]: [date + 'T00:00:00.000Z', date + 'T23:59:59.999Z'] } },
                        { dischargeDate: { [Op.between]: [date + 'T00:00:00.000Z', date + 'T23:59:59.999Z'] } }
                    ]
                }
            });

            return res.status(200).json({ count: patients.length, patients });
        } catch (error) {
            console.error('Error fetching patients by disease and date:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getPatientDataBetweenDates: async (req, res) => {
        try {
            const { startDate, endDate, type } = req.query;
            const whereCondition = type === 'admitted' ?
                { admitDate: { [Op.between]: [startDate + 'T00:00:00.000Z', endDate + 'T23:59:59.999Z'] } } :
                { dischargeDate: { [Op.between]: [startDate + 'T00:00:00.000Z', endDate + 'T23:59:59.999Z'] } };

            const patients = await Patient.findAll({
                where: whereCondition
            });

            const count = patients.length;

            return res.status(200).json({ count, patients });
        } catch (error) {
            console.error('Error fetching patient data between dates:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

};
