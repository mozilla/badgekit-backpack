const db = require('../lib/db')
const Earners = db.table('earners', {
  fields: [ 'id', 'createdOn' ],
  relationships: {
    // badges: {
    //   type: 'hasMany',
    //   local: 'id',
    //   foreign: { table: 'earnerBadges', key: 'earnerId' },
    //   optional: true,
    // },
    _metadata: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'earnerData', key: 'earnerId' },
      optional: true,
    },
  },
  methods: {
    metadata: function () {
      const data = this._metadata || []
      return data.reduce(function (acc, datum) {
        acc[datum.key] = datum.value
        return acc
      }, {})
    }
  }
})

module.exports = Earners
