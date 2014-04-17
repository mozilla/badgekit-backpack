const db = require('../lib/db')
const xtend = require('xtend')
const Earners = db.table('earners', {
  fields: [ 'id', 'createdOn' ],
  relationships: {
    badges: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'earnerBadges', key: 'earnerId' },
      optional: true,
    },
    _metadata: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'earnerData', key: 'earnerId' },
      optional: true,
    },
  },
  constructor: function (obj) {
    const proto = Earners.methods || {}
    const data = obj._metadata || []
    obj.metadata = data.reduce(function (acc, datum) {
      acc[datum.key] = datum.value
      return acc
    }, {})
    return xtend(Object.create(proto), obj)
  },
})

module.exports = Earners
