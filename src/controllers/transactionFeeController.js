const { getModelledArrayOfFees, responseCode, errorResponse } = require('../utilities/helpers');

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
       const filterObject = {
        $and: []
      }
      if (req.body.CurrencyCountry !== req.body.PaymentEntity.Country) {
        filterObject.$and.push({ $or: [
          { fee_locale: 'INTL'},
          { fee_locale: '*'}
        ]})
      } else {
        filterObject.$and.push({ $or: [
          { fee_locale: 'LOCL'},
          { fee_locale: '*'}
        ]})
      }
      if (req.body.PaymentEntity.Type) {
        filterObject.$and.push({ $or: [
          { fee_entity: req.body.PaymentEntity.Type},
          { fee_entity: '*'}
        ]})
      }
      if (req.body.PaymentEntity.Type) {
        filterObject.$and.push({ $or: [
          { fee_entity: req.body.PaymentEntity.Type},
          { fee_entity: '*'}
        ]})
      }
      if (req.body.PaymentEntity.Type) {
        filterObject.$and.push({ $or: [
          { entity_property: req.body.PaymentEntity.Type},
          { entity_property: '*'}
        ]})
      }
        const docs = await this.mainRepo.getCollection(filterObject);
        res.send(docs)
      } catch (err) {
        console.log(err);
        return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
      }
    }
  
}
module.exports = TransactionFeesController;
