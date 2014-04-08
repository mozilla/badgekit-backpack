const db = require('../lib/db')
const BadgeClasses = db.table('badgeClasses', {
  fields: [
    'id',
    'jsonId',
    'issuerOrgId',
    'name',
    'description',
    'imageUrl',
    'criteriaUrl',
    'issuerJSONUrl',
  ],
  relationships: {
    json: {
      type: 'hasOne',
      local: 'jsonId',
      foreign: { table: 'json', key: 'id' },
    },
    issuer: {
      type: 'hasOne',
      local: 'issuerOrgId',
      foreign: { table: 'issuerOrg', key: 'id' },
    },
  },
})

module.exports = BadgeClasses
