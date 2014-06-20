const db = require('../lib/db')
const IssuerTokens = db.table('issuerTokens', {
  fields: [ 'id', 'name', 'key', 'token' ],
})

module.exports = IssuerTokens;
