const db = require('../lib/db')
const EarnerData = db.table('earnerData', {
  fields: [ 'id', 'earnerId', 'key', 'value' ],
  relationships: {
    earner: {
      type: 'hasOne',
      local: 'earnerId',
      foreign: { table: 'earners', key: 'id' },
    },
  },
})
module.exports = EarnerData
