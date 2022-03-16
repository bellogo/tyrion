const express = require('express')

const router = express.Router()

const feesRoute = require('./feesRoute')
const computeTransactionFeeRoute = require('./transactionFeeRoute')

router.get('', (req, res) => res.send('Welcome to Lannister Pay'))

router.use('/fees', feesRoute)
router.use('/compute-transaction-fee', computeTransactionFeeRoute)

module.exports = router
