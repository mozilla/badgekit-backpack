const db = require('../lib/db')
const IssuerOrgs = db.table('issuerOrgs', {
  fields: [
    'id',
    'createdOn',
    'jsonUrl',
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
      local: 'jsonUrl',
      foreign: { table: 'json', key: 'url' },
    },
  },
})

module.exports = IssuerOrgs
