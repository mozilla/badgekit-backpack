const db = require('../lib/db')
const Earners = db.table('earners', {
  fields: [ 'id', 'createdOn' ],
  relationships: {
    badges: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'earnerBadges', key: 'earnerId' },
      optional: true,
    },
    extra: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'earnerData', key: 'earnerId' },
      optional: true,
    },
  },
})
const EarnerData = db.table('earnerData', {
  fields: [ 'id', 'earnerId', 'key', 'value' ],
  relationships: {
    earner: {
      type: 'hasOne',
      local: 'earnerId',
      foreign: { table: 'earners', key: 'id' },
    }
  }
})
module.exports = Earners
