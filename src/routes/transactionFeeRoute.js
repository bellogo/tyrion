const express = require('express')

const Validations = require('../middleware/joi_validations')

const allValidations = new Validations()
const { transactionFeeValidation } = allValidations

const TransactionFeeController = require('../controllers/transactionFeeController')
const FeeConfigurationSpecRepository = require('../repositories/feeConfigurationSpecRepository')
const transactionFeeController = new TransactionFeeController(new FeeConfigurationSpecRepository())

const router = express.Router()

router.post('/', transactionFeeController.computeFee)

module.exports = router
