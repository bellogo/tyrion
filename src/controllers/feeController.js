const {
  getModelledArrayOfFees,
  responseCode,
  errorResponse,
} = require('../utilities/helpers');
const { SchemaFieldTypes, createClient } = require('redis');
// import { createClient, SchemaFieldTypes } from 'redis';

// const client = require('../services/redis');

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
        await client.ft.create(
          'idx:animals',
          {
            name: {
              type: SchemaFieldTypes.TEXT,
              sortable: true,
            },
            species: SchemaFieldTypes.TAG,
            age: SchemaFieldTypes.NUMERIC,
          },
          {
            ON: 'HASH',
            PREFIX: 'noderedis:animals',
          }
        );
        // await client.ft.create('idx:fee', {
        //   fee_id: {
        //     type: SchemaFieldTypes.TEXT,
        //     sortable: true
        //   },
        //   fee_currency: {
        //     type: SchemaFieldTypes.TEXT,
        //     sortable: true
        //   },
        //   fee_locale: {
        //     type: SchemaFieldTypes.TEXT,
        //     sortable: true
        //   },
        //   fee_entity: {
        //     type: SchemaFieldTypes.TEXT,
        //     sortable: true
        //   },
        //   entity_property: {
        //     type: SchemaFieldTypes.TEXT,
        //     sortable: true
        //   },
        //   fee_type: {
        //     type: SchemaFieldTypes.TEXT,
        //     sortable: true
        //   },
        //   fee_value: {
        //     type: SchemaFieldTypes.TEXT,
        //     sortable: true
        //   }
        // }, {
        //   ON: 'HASH',
        //   PREFIX: 'lannister:fee'
        // });
      } catch (e) {
        if (e.message === 'Index already exists') {
          console.log('Index exists already, skipped creation.');
        } else {
          // Something went wrong, perhaps RediSearch isn't installed...
          console.error(e);
        }
      }

      const saveHashes = [];

      const { FeeConfigurationSpec } = req.body;
      const modelledFees = await getModelledArrayOfFees(FeeConfigurationSpec);
      modelledFees.forEach((fee, index) => {
        saveHashes.push(
          client.hSet(`lannister:fee:${index + 1}`, {
            fee_id: fee.fee_id,
            fee_currency: fee.fee_currency,
            fee_locale: fee.fee_locale,
            fee_entity: fee.fee_entity,
            entity_property: fee.entity_property,
            fee_type: fee.fee_type,
            fee_value: fee.fee_value,
          })
        );
      });
      await Promise.all(saveHashes);
      return res.status(200).json({
        status: 'ok',
      });
    } catch (err) {
      // if (err.code === 11000) {// error code for duplicate FEE-ID after saving unique ones
      //   return res.status(200).json({ "status": "ok" });
      // }
      console.log(err);
      return errorResponse(
        res,
        responseCode.INTERNAL_SERVER_ERROR,
        'An error occurred.',
        err
      );
    }
  };

  trial = async (req, res) => {
    const { redisURL } = require('../../config');

    const client = createClient({
      url: redisURL,
    });
    await client.connect();
    try {
      await client.ft.create(
        'idx:animals',
        {
          fee_id: {
            type: SchemaFieldTypes.TAG,
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
          },
        },
        {
          ON: 'HASH',
          PREFIX: 'noderedis:animals',
        }
      );
    } catch (e) {
      if (e.message === 'Index already exists') {
        console.log('Index exists already, skipped creation.');
      } else {
        console.error(e);
        process.exit(1);
      }
    }
    await Promise.all([
      client.hSet('noderedis:animals:1', {
        fee_id: 'LNPY1221',
        fee_currency: 'NGN',
        fee_locale: '*',
        fee_entity: '*',
        entity_property: '*',
        fee_type: 'PERC',
        fee_value: '1.4'
      }),
      client.hSet('noderedis:animals:2', {
        fee_id: 'LNPY1222',
        fee_currency: 'NGN',
        fee_locale: 'LOCL',
        fee_entity: 'CREDIT-CARD',
        entity_property: '*',
        fee_type: 'FLAT_PERC',
        fee_value: '50:1.4'
      }),
      
    ]);

    // Perform a search query, find all the dogs...
    // Documentation: https://oss.redis.com/redisearch/Commands/#ftsearch
    // Query synatax: https://oss.redis.com/redisearch/Query_Syntax/
    const results = {
      message: "saved to redis"
    }

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
    res.send(results);
    await client.quit();
  };
}
module.exports = FeeController;
