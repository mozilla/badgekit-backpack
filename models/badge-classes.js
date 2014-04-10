const db = require('../lib/db')
const BadgeClasses = db.table('badgeClasses', {
  fields: [
    'id',
    'createdOn',
    'jsonUrl',
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
      local: 'jsonUrl',
      foreign: { table: 'json', key: 'url' },
    },
    issuer: {
      type: 'hasOne',
      local: 'issuerOrgId',
      foreign: { table: 'issuerOrgs', key: 'id' },
    },
  },
})

module.exports = BadgeClasses
