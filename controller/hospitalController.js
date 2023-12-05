const Hospital = require('../model/hospitalModel');

module.exports = {

    validateUpdateHospital(req, res, next) {
        const { phoneNumber, capacity } = req.body;

        // Basic conditional checks
        if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        if (capacity && !isValidPositiveInteger(capacity)) {
            return res.status(400).json({ error: 'Capacity must be a positive integer' });
        }

        // No validation errors, proceed to the next middleware
        next();
    },

    // Function to check if a phone number is valid
    isValidPhoneNumber(phoneNumber) {
        return /^\d{10}$/.test(phoneNumber);
    },

    // create new hospital
    async createHospital(req, res) {
        try {
            const { name, email, phoneNumber, city, state, capacity } = req.body;

            if (!name || !email || !phoneNumber || !city || !state || !capacity) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            if (!/^\d{10}$/.test(phoneNumber)) {
                return res.status(400).json({ error: 'Invalid phone number' });
            }

            const existingHospital = await Hospital.findOne({
                where: {
                    name: name,
                },
            });
            console.log("existingHospital  ", existingHospital)
            if (existingHospital) {
                return res.status(400).json({ error: 'Hospital name must be unique' });
            }

            const existingEmail = await Hospital.findOne({
                where: {
                    email: email,
                },
            });

            if (existingEmail) {
                return res.status(400).json({ error: 'Email must be unique' });
            }
            const existingPhoneNumber = await Hospital.findOne({
                where: {
                    phoneNumber: phoneNumber,
                },
            });

            if (existingPhoneNumber) {
                return res.status(400).json({ error: 'Phone number must be unique' });
            }

            const hospital = await Hospital.create({ name, email, phoneNumber, city, state, capacity });

            return res.status(201).json({ message: "Hospital added successfully.", data: hospital });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    // Get all hospitals
    async getAllHospitals(req, res) {
        try {
            const hospitals = await Hospital.findAll({});
            return res.status(200).json(hospitals);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get a specific hospital by ID
    async getHospitalById(req, res) {

        try {
            const hospitalId = req.params.id;
            const hospital = await Hospital.findByPk(hospitalId);
            if (!hospital) {
                return res.status(404).json({ error: 'Hospital not found' });
            }
            return res.status(200).json(hospital);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update a hospital by ID
    async updateHospitalById(req, res) {
        try {
            if (!req.body.phoneNumber || !this.isValidPhoneNumber(phoneNumber)) {
                return res.status(400).json({ error: 'Invalid phone number' });
            }
            const hospitalId = req.params.id;
            const [updatedRowsCount] = await Hospital.update(req.body, {
                where: { id: hospitalId }
            });

            if (updatedRowsCount === 0) {
                return res.status(404).json({ error: 'Hospital not found' });
            }

            const updatedHospital = await Hospital.findByPk(hospitalId);
            return res.status(200).json(updatedHospital);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Delete a hospital by ID
    async deleteHospitalById(req, res) {
        try {
            const hospitalId = req.params.id;
            const deletedRowsCount = await Hospital.destroy({
                where: { id: hospitalId },
            });

            if (deletedRowsCount === 0) {
                return res.status(404).json({ error: 'Hospital not found' });
            }

            return res.status(204).json(); // No content
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }



};
