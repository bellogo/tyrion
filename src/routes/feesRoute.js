const express = require('express');

const Validations = require('../middleware/joi_validations');

const allValidations = new Validations();
const { feesValidation } = allValidations;

const FeeController = require('../controllers/feeController');
const FeeConfigurationSpecRepository = require('../repositories/feeConfigurationSpecRepository');
const feeController = new FeeController(new FeeConfigurationSpecRepository());


const router = express.Router();

router.post('/', feesValidation, feeController.saveFees);


module.exports = router;
