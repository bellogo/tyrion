const { getModelledArrayOfFees, responseCode, errorResponse } = require('../utilities/helpers');
const { SchemaFieldTypes, createClient } = require('redis');
const { redisURL } = require('../../config')
        const client = createClient({
          url: redisURL
        })

  
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
        await client.connect();

        const { CurrencyCountry, PaymentEntity} = req.body
        let fee_locale;
        if (CurrencyCountry !== PaymentEntity.Country) {
          fee_locale = 'INTL';
        } else {
          fee_locale = 'LOCL';
        }

        const results = await client.ft.search('idx:fee', `@fee_locale:${fee_locale} @fee_entity:${PaymentEntity.Type} @entity_property:(${PaymentEntity.ID}|${PaymentEntity.Issuer}|${PaymentEntity.Brand}|${PaymentEntity.Number}|${PaymentEntity.SixID})`);
      res.send(results);

      //  const filterObject = {
      //   $and: []
      // }
      // if (req.body.CurrencyCountry !== req.body.PaymentEntity.Country) {
      //   filterObject.$and.push(
      //     { fee_locale: 'INTL'})
      // } else {
      //   filterObject.$and.push(
      //     { fee_locale: 'LOCL'})
      // }
      //   filterObject.$and.push(
      //     { fee_entity: req.body.PaymentEntity.Type}) 
      //   filterObject.$and.push({ $or: [
      //   { entity_property: req.body.PaymentEntity.ID},
      //   { entity_property: req.body.PaymentEntity.Issuer},
      //   { entity_property: req.body.PaymentEntity.Brand},
      //   { entity_property: req.body.PaymentEntity.Number},
      //   { entity_property: req.body.PaymentEntity.SixID},
      //   { entity_property: '*'}
      // ]})      
      //   let docs = await this.mainRepo.getCollection(filterObject)
      //   console.log(docs);

        // if (docs.length === 0) {
          // console.log('it sees');
          // const filter = {
          //   $and: []
          // }

          // if (req.body.CurrencyCountry !== req.body.PaymentEntity.Country) {
          //   filter.$and.push({ $or: [
          //     { fee_locale: 'INTL'},
          //     { fee_locale: '*'}
          //   ]})
          // } else {
          //   filter.$and.push({ $or: [
          //     { fee_locale: 'LOCL'},
          //     { fee_locale: '*'}
          //   ]})
          // }
          // filter.$and.push({ $or: [
          //   { fee_currency: req.body.Currency},
          //   { fee_currency: '*'}
          // ]}) 
          // filter.$and.push({ $or: [
          //     { fee_entity: req.body.PaymentEntity.Type},
          //     { fee_entity: '*'}
          //   ]}) 
          //   filter.$and.push({ $or: [
          //     { entity_property: req.body.PaymentEntity.ID},
          //     { entity_property: req.body.PaymentEntity.Issuer},
          //     { entity_property: req.body.PaymentEntity.Brand},
          //     { entity_property: req.body.PaymentEntity.Number},
          //     { entity_property: req.body.PaymentEntity.SixID},
          //     { entity_property: '*'}
          //   ]})
          //  const docs = await this.mainRepo.getCollection(filter); 
          // if (docs.length === 0) return errorResponse(res, responseCode.BAD_REQUEST, 'No fee configuration for this transaction.');

          //  console.log(docs);
            // res.send(docs)  
        // }else {
        //   res.send(docs)
        // }
        // res.send(JSON.stringify(docs))
        // console.log(JSON.stringify(docs));
      } catch (err) {
        console.log(err);
        return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
      }
    }

    first = async (req, res) => {
      try {
        
        await client.connect();
  const results = await client.ft.search('idx:animals', '@fee_currency:NGN');

  // results:
  // {
  //   total: 2,
  //   documents: [
  //     { 
  //       id: 'noderedis:animals:4',
  //       value: {
  //         name: 'Fido',
  //         species: 'dog',
  //         age: '7'
  //       }
  //     },
  //     {
  //       id: 'noderedis:animals:3',
  //       value: {
  //         name: 'Rover',
  //         species: 'dog',
  //         age: '9'
  //       }
  //     }
  //   ]
  // }
 
  // console.log(`Results found: ${results.total}.`);

  // for (const doc of results.documents) {
  //   // noderedis:animals:4: Fido
  //   // noderedis:animals:3: Rover
  //   console.log(`${doc.id}: ${doc.value.name}`);
  // }
res.send(results)
  await client.quit();
} catch (error) {
  
}

    }
  
}
module.exports = TransactionFeesController;
