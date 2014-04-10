const db = require('../lib/db')
const xtend = require('xtend')
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
  constructor: function (obj) {
    const proto = EarnerBadges.methods || {}
    const nullTime = '0000-00-00 00:00:00'
    if (obj.issuedOn === nullTime)
      obj.issuedOn = null
    if (obj.expires === nullTime)
      obj.expires = null
    return xtend(Object.create(proto), obj)
  },
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
