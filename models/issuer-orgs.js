const db = require('../lib/db')
const IssuerOrgs = db.table('issuerOrgs', {
  fields: [
    'id',
    'jsonId',
    'name',
    'url',
    'description',
    'imageUrl',
    'email',
    'revocationList',
  ],
  relationships: {
    json: {
      type: 'hasOne',
      local: 'jsonId',
      foreign: { table: 'json', key: 'id' },
    },
  },
})

module.exports = IssuerOrgs
