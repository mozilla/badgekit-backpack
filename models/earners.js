const db = require('../lib/db')
const copy = require('../lib/copy')
const Earners = db.table('earners', {
  fields: [ 'id', 'createdOn', 'under13' ],
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
    delete obj._metadata
    return copy(Object.create(proto), obj)
  },
  methods: {
    toResponse: function (req) {
      return Earners.toResponse(this, req)
    }
  }
})

function toResponse(obj, req) {
  const EarnerBadges = require('./earner-badges')
  obj = obj || this
  return {
    id: obj.id,
    under13: obj.under13,
    createdOn: obj.createdOn,
    badges: obj.badges.map(function (badge) {
      return EarnerBadges.toResponse(badge, req)
    }),
    metadata: obj.metadata,
  }
}

Earners.toResponse = toResponse

module.exports = Earners
