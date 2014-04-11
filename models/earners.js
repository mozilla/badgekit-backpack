const db = require('../lib/db')
const copy = require('../lib/copy')
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
    delete obj._metadata
    return copy(Object.create(proto), obj)
  },
  methods: { toResponse: toResponse }
})

function toResponse(obj) {
  obj = obj || this
  return {
    id: obj.id,
    createdOn: obj.createdOn,
    badges: obj.badges,
    metadata: obj.metadata,
  }
}

Earners.toResponse = toResponse

module.exports = Earners
