const express = require('express');
const router = express.Router();
const patientController = require('../controller/patientController');

router.post('/addPatient', patientController.createPatient);
router.get('/patients', patientController.readPatients);
router.get('/patients/:id', patientController.readPatientById);
router.post('/patients/by-date', patientController.getPatientsByDate);
router.post('/patients/by-disease-and-date', patientController.getPatientsByDiseaseAndDate);
router.post('/patients/between-dates', patientController.getPatientDataBetweenDates);
router.put('/updatePatients/:id', patientController.updatePatientById);
router.delete('/patients/:id', patientController.deletePatientById);

module.exports = router;
