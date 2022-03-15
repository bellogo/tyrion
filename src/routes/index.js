const express = require('express');

const router = express.Router();

const feeRoute = require('./fee_route');
const computeTransactionFeeRoute = require('./compute_transaction_fee_route');


router.get('/', (req, res) => res.send('Welcome to Lannister Pay'));
// router.use('/fee', feeRoute);
// router.use('/compute-transaction-fee', computeTransactionFeeRoute);

module.exports = router;
