const { getModelledArrayOfFees, responseCode, errorResponse } = require('../utilities/helpers');
const { SchemaFieldTypes } = require('redis');
const client = require('../services/redis');

class FeeController {
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
    saveFees = async (req, res) => {
      try {
        
        await client.connect();

        // Create an index...
        try {
          // Documentation: https://oss.redis.com/redisearch/Commands/#ftcreate
          await client.ft.create('idx:fee', {
            fee_id: {
              type: SchemaFieldTypes.TEXT,
              sortable: true
            },
            fee_currency: {
              type: SchemaFieldTypes.TEXT,
              sortable: true
            },
            fee_locale: {
              type: SchemaFieldTypes.TEXT,
              sortable: true
            },
            fee_entity: {
              type: SchemaFieldTypes.TEXT,
              sortable: true
            },
            entity_property: {
              type: SchemaFieldTypes.TEXT,
              sortable: true
            },
            fee_type: {
              type: SchemaFieldTypes.TEXT,
              sortable: true
            },
            fee_value: {
              type: SchemaFieldTypes.TEXT,
              sortable: true
            }
          }, {
            ON: 'HASH',
            PREFIX: 'lannister:fee'
          });
        } catch (e) {
          if (e.message === 'Index already exists') {
            console.log('Index exists already, skipped creation.');
          } else {
            // Something went wrong, perhaps RediSearch isn't installed...
            console.error(e);
          }
        }

        const saveHashes =[]

        const { FeeConfigurationSpec } = req.body;
        const modelledFees = await getModelledArrayOfFees(FeeConfigurationSpec);
        modelledFees.forEach((fee, index) => {
          saveHashes.push(client.hSet(`lannister:fee:${index+1}`, { fee_id: fee.fee_id, fee_currency: fee.fee_currency, fee_locale: fee.fee_locale, fee_entity:fee.fee_entity, entity_property: fee.entity_property, fee_type: fee.fee_type, fee_value:fee.fee_value  }))
        });
        await Promise.all(saveHashes)
        return res.status(200).json({ "status": "ok" });
        } catch (err) {
        // if (err.code === 11000) {// error code for duplicate FEE-ID after saving unique ones
        //   return res.status(200).json({ "status": "ok" });
        // }
        console.log(err);
        return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
      }
    }
  
}
module.exports = FeeController;
