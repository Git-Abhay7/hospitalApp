const express = require('express');
const router = express.Router();
const hospitalController = require('../controller/hospitalController');

router.post('/addHospital', hospitalController.createHospital);
router.get('/hospitals', hospitalController.getAllHospitals);
router.get('/hospitals/:id', hospitalController.getHospitalById);
router.put('/hospitals/:id', hospitalController.updateHospitalById);
router.delete('/hospitals/:id', hospitalController.deleteHospitalById);

module.exports = router;
