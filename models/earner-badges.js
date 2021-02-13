const db = require('../lib/db')
const copy = require('../lib/copy')
const EarnerBadges = db.table('earnerBadges', {
  fields: [
    'id',
    'createdOn',
    'jsonUrl',
    'earnerId',
    'badgeClassId',
    'uid',
    'imageUrl',
    'badgeImageSlug',
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
    return copy(Object.create(proto), obj)
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

EarnerBadges.toResponse = function toResponse(obj, req) {
  const response = {
    id: obj.id,
    createdOn: obj.createdOn,
    jsonUrl: obj.jsonUrl,
    earnerId: obj.earnerId,
    uid: obj.uid,
    bakedBadgeUrl: obj.badgeImageSlug
      ? '/public/images/' + obj.badgeImageSlug
      : null,
    badgeJSONUrl: obj.badgeJSONUrl,
    evidenceUrl: obj.evidenceUrl,
    issuedOn: obj.issuedOn,
    badgeClass: obj.badgeClass,
  }
  if (req && response.bakedBadgeUrl)
    response.bakedBadgeUrl = req.resolvePath(response.bakedBadgeUrl)
  return response
}
module.exports = EarnerBadges
