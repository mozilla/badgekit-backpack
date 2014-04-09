const db = require('../lib/db')
const EarnerBadges = db.table('earnerBadges', {
  fields: [
    'id',
    'createdOn',
    'jsonUrl',
    'earnerId',
    'badgeClassId',
    'uid',
    'imageUrl',
    'badgeJSONUrl',
    'evidenceUrl',
    'issuedOn',
    'expires',
  ],
  relationships: {
    earner: {
      type: 'hasOne',
      local: 'earnerId',
      foreign: { table: 'earners', key: 'id' },
    },
    json: {
      type: 'hasOne',
      local: 'jsonUrl',
      foreign: { table: 'json', key: 'url' },
    },
    badgeClass: {
      type: 'hasOne',
      local: 'badgeClassId',
      foreign: { table: 'badgeClasses', key: 'id' },
    },
  },
})

module.exports = EarnerBadges
