const db = require('../lib/db')
const JSON = db.table('json', {
  fields: [ 'id', 'data', 'url', 'updatedOn' ],
  relationships: {
    assertion: {
      type: 'hasOne',
      local: 'id',
      foreign: { table: 'earnerBadges', key: 'jsonId' },
      optional: true,
    },
    badge: {
      type: 'hasOne',
      local: 'id',
      foreign: { table: 'earnerBadges', key: 'jsonId' },
      optional: true,
    },
    issuer: {
      type: 'hasOne',
      local: 'id',
      foreign: { table: 'earnerBadges', key: 'jsonId' },
      optional: true,
    },
  },
})

module.exports = JSON
