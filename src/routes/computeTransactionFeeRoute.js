const express = require('express');
const {
  responseCode, errorResponse, successResponse, generateJWT, comparePasswords, generateRandomString, hashPassword,
} = require('../utilities/helpers');

const router = express.Router();

router.post('/', (req, res) => {
  return successResponse(res, responseCode.SUCCESS, 'welcome');
});


module.exports = router;
