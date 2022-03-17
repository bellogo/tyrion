const { createClient, SchemaFieldTypes } = require('redis');
const { redisURL } = require('../../config')

const client = createClient({
  url: redisURL
})

module.exports = client;



// const createHashIndex = async () => {
//   await client.connect();

//   // Create an index...
//   try {
//     // Documentation: https://oss.redis.com/redisearch/Commands/#ftcreate
//     await client.ft.create('idx:fee', {
//       fee_id: {
//         type: SchemaFieldTypes.TEXT,
//         sortable: true
//       },
//       fee_currency: {
//         type: SchemaFieldTypes.TEXT,
//         sortable: true
//       },
//       fee_locale: {
//         type: SchemaFieldTypes.TEXT,
//         sortable: true
//       },
//       fee_entity: {
//         type: SchemaFieldTypes.TEXT,
//         sortable: true
//       },
//       entity_property: {
//         type: SchemaFieldTypes.TEXT,
//         sortable: true
//       },
//       fee_type: {
//         type: SchemaFieldTypes.TEXT,
//         sortable: true
//       },
//       fee_value: {
//         type: SchemaFieldTypes.TEXT,
//         sortable: true
//       }
//     }, {
//       ON: 'HASH',
//       PREFIX: 'lannister:fee'
//     });
//   } catch (e) {
//     if (e.message === 'Index already exists') {
//       console.log('Index exists already, skipped creation.');
//     } else {
//       // Something went wrong, perhaps RediSearch isn't installed...
//       console.error(e);
//       process.exit(1);
//     }
//   }

//   // Add some sample data...
//   await Promise.all([
//     client.hSet('noderedis:animals:1', { name: 'Fluffy', species: 'cat', age: 3 }),
//     client.hSet('noderedis:animals:2', { name: 'Ginger', species: 'cat', age: 4 }),
//     client.hSet('noderedis:animals:3', { name: 'Rover', species: 'dog', age: 9 }),
//     client.hSet('noderedis:animals:4', { name: 'Fido', species: 'dog', age: 7 })
//   ]);

//   // Perform a search query, find all the dogs...
//   // Documentation: https://oss.redis.com/redisearch/Commands/#ftsearch
//   // Query synatax: https://oss.redis.com/redisearch/Query_Syntax/
//   const results = await client.ft.search('idx:animals', '@species:{dog}');

//   // results:
//   // {
//   //   total: 2,
//   //   documents: [
//   //     {
//   //       id: 'noderedis:animals:4',
//   //       value: {
//   //         name: 'Fido',
//   //         species: 'dog',
//   //         age: '7'
//   //       }
//   //     },
//   //     {
//   //       id: 'noderedis:animals:3',
//   //       value: {
//   //         name: 'Rover',
//   //         species: 'dog',
//   //         age: '9'
//   //       }
//   //     }
//   //   ]
//   // }

//   console.log(`Results found: ${results.total}.`);

//   for (const doc of results.documents) {
//     // noderedis:animals:4: Fido
//     // noderedis:animals:3: Rover
//     console.log(`${doc.id}: ${doc.value.name}`);
//   }

//   await client.quit();
// }

// searchHashes();
