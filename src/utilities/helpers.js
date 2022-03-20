/**
 * create a modelled object from inputed string
 * @param {string} FeeConfigurationSpec
 * @return {array of objects}
 */
exports.getModelledArrayOfFees = async (FeeConfigurationSpec) => {
  const feeArray = FeeConfigurationSpec.split('\n');
  let splited;
  let subSplit;
  const newFeeArray = await feeArray.map(fee => {
    splited = fee.split(' ')
    subSplit = splited[3].split('(');
    return { fee_id: splited[0], fee_currency: splited[1], fee_locale: splited[2], fee_entity: subSplit[0], entity_property: subSplit[1].slice(0, -1), fee_type: splited[6], fee_value: splited[7] }
  });
  return newFeeArray;
}

/**
 * calculates charge amount
 * @param {number} aappliedFeeValue
 * @param {number} Amount
 * @param {object} Customer
 * @returns {number}
 */
exports.getChargeAmount = (aappliedFeeValue, Amount, Customer) => {
  if (Customer.BearsFee === true) {
    return Amount + aappliedFeeValue;
  } else {
    return Amount;
  }
}

/**
 * calculate applied fee value based on fee type
 * @param {object} feeConfig
 * @param {number} Amount
 * @returns {number}
 */
exports.getAppliedFeeValue = (feeConfig, Amount) => {
  if (feeConfig.fee_type === 'FLAT_PERC') {
    const feeValueArray = feeConfig.fee_value.split(':');
    const flat = parseFloat(feeValueArray[0]);
    const perc = parseFloat(feeValueArray[1]);
    return Math.round(flat + ((perc / 100) * Amount))
  }
  const feeValue = parseFloat(feeConfig.fee_value)
  if (feeConfig.fee_type === 'FLAT') {
    return feeValue;
  }
  if (feeConfig.fee_type === 'PERC') {
    return Math.round((feeValue / 100) * Amount)
  }
}

/** *******************************
 *  Response Code Helpers
 ********************************* */
exports.responseCode = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOW: 405,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  ACCOUNT_NOT_VERIFIED: 209
};

/**
 * The validation rule
 * @param req
 * @param res
 * @param next
 * @param schema
 */
exports.validateRequest = (object, res, next, schema) => {
  const FormattedError = [];

  const options = {
    abortEarly: false, // include all errors
    allowUnknown: false // ignore unknown props
    // stripUnknown: true, // remove unknown props
  };
  const { error, data } = schema.validate(object, options);
  if (error) {
    /**
         * loop through the error messages and return readable error message
         */
    error.details.forEach((e) => {
      FormattedError.push(e.message.replace(/"/g, ''));
    });

    /**
         * returns a single error at a time
         */
    return this.errorResponse(
      res,
      this.responseCode.UNPROCESSABLE_ENTITY,
      'A validation error has occurred',
      FormattedError,
      object.files
    );
  }
  // req.body = req.body;

  return next();
};

/**
 *
 * @param {object} res response object
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data
 * @returns {object} res
 */
exports.successResponse = function (res, statusCode = this.responseCode.SUCCESS,
  message = 'success', data = null) {
  res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

/**
 *
 * @param {object} res response object
 * @param {number} statusCode
 * @param {string} message
 * @param {*} errors
 * @param files
 * @returns {object} res
 */
exports.errorResponse = function (res, statusCode = this.responseCode.NOT_FOUND,
  message = 'error', errors = []) {
  res.status(statusCode).json({
    status: 'error',
    message,
    errors
  });
};
