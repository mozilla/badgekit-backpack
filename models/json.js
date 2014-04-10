const db = require('../lib/db')
const JSON = db.table('json', {
  primaryKey: 'url',
  fields: [ 'url', 'data', 'updatedOn' ],
  relationships: {
    assertion: {
      type: 'hasOne',
      local: 'url',
      foreign: { table: 'earnerBadges', key: 'jsonUrl' },
      optional: true,
    },
    badge: {
      type: 'hasOne',
      local: 'url',
      foreign: { table: 'badgeClasses', key: 'jsonUrl' },
      optional: true,
    },
    issuer: {
      type: 'hasOne',
      local: 'url',
      foreign: { table: 'issuerOrgs', key: 'jsonUrl' },
      optional: true,
    },
  },
})

module.exports = JSON
