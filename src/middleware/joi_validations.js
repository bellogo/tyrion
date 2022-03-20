/* eslint-disable class-methods-use-this */
const Joi = require('joi')
const helpers = require('../utilities/helpers')

module.exports = class Validations {
  /**
 * fee payload Validation
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
  async feesValidation (req, res, next) {
    const schema = Joi.object({
      FeeConfigurationSpec: Joi.string().empty().required()
    })
    await helpers.validateRequest(req.body, res, next, schema)
  }

  /**
 * compute Transaction Fee payload Validation
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
  async transactionFeeValidation (req, res, next) {
    const schema = Joi.object({
      ID: Joi.number(),
      Amount: Joi.number(),
      Currency: Joi.string(),
      CurrencyCountry: Joi.string(),
      Customer: Joi.object().keys({
        ID: Joi.number(),
        EmailAddress: Joi.string(),
        FullName: Joi.string(),
        BearsFee: Joi.boolean()
      }),
      PaymentEntity: Joi.object().keys({
        ID: Joi.number(),
        Issuer: Joi.string(),
        Brand: Joi.any(),
        Number: Joi.string(),
        SixID: Joi.any(),
        Type: Joi.string(),
        Country: Joi.string()
      })
    })
    await helpers.validateRequest(req.body, res, next, schema)
  }
}
