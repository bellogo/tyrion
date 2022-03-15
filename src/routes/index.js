const express = require('express');

const router = express.Router();

const feeRoute = require('./feeRoute');
const computeTransactionFeeRoute = require('./computeTransactionFeeRoute');


router.get('', (req, res) => res.send('Welcome to Lannister Pay'));

// router.use('/fee', feeRoute);
// router.use('/compute-transaction-fee', computeTransactionFeeRoute);

module.exports = router;
