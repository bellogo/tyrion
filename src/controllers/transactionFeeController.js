const { getAppliedFeeValue, getChargeAmount, responseCode, errorResponse } = require('../utilities/helpers');

class TransactionFeesController {
  constructor(mainRepo) {
    this.mainRepo = mainRepo;
  }

  /**
   * save fee configurations
   * 
   * @static
   * @param {*} req
   * @param {*} res
   * @return {*}
   */
  computeFee = async (req, res) => {
    try {
      const { CurrencyCountry, PaymentEntity, Currency, Amount, Customer} = req.body
      const {Country, ID, Issuer, Brand, SixID, Type} = PaymentEntity;
      let fee_locale;
      if (Currency !== 'NGN') {
        return res.status(400).json({
          "Error": `No fee configuration for ${Currency} transactions.`
        });
      }
      if (CurrencyCountry !== PaymentEntity.Country) {
        fee_locale = 'INTL';
      } else {
        fee_locale = 'LOCL';
      }
      const filter = {
        $and: []
      }
      if (CurrencyCountry !== Country) {
        filter.$and.push({
          $or: [{ fee_locale: 'INTL'}, { fee_locale: '*'}]
        })
      } else {
        filter.$and.push({
          $or: [{fee_locale: 'LOCL'}, { fee_locale: '*'}]
        })
      }
      filter.$and.push({
        $or: [{ fee_entity: Type }, { fee_entity: '*'}]
      })
      filter.$and.push({
        $or: [
          {entity_property: ID},
          {entity_property: Issuer},
          {entity_property: Brand},
          {entity_property: PaymentEntity.Number},
          {entity_property: SixID},
          {entity_property: '*'}]
      })
      const docs = await this.mainRepo.getCollection(filter);
      if (docs.length === 0) return errorResponse(res, responseCode.BAD_REQUEST, 'No fee configuration for this transaction.');

      const appliedFeeValue = getAppliedFeeValue(docs[0], Amount);
      const chargeAmount = getChargeAmount(appliedFeeValue, Amount, Customer);
    
      return res.status(200).json({
        "AppliedFeeID": docs[0].fee_id,
        "AppliedFeeValue": appliedFeeValue,
        "ChargeAmount": chargeAmount,
        "SettlementAmount": chargeAmount - appliedFeeValue
    });

    } catch (err) {
      console.log(err);
      return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
    }
  }
}
module.exports = TransactionFeesController;
