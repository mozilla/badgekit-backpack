const test = require('tap').test
const prepare = require('./')
const EarnerBadges = require('../../models/earner-badges')

prepare().then(function (db) {
  test('Sanity test', function (t) {
    const data = {
      earnerId: 'test-user',
      jsonUrl: 'http://example.org/26',
      badgeClassId: 1,
      uid: 'some-badge-assertion',
      imageUrl: 'http://example.org/image.png',
      badgeJSONUrl: 'http://example.org/badge.json',
    }

    EarnerBadges.put(data)
      .then(function() {
        return EarnerBadges.getOne({id: 1}, {relationships: true})
      })
      .then(function(assertion) {
        t.ok(assertion.earner, 'has earner data')
        t.ok(assertion.json, 'has json')
        t.ok(assertion.badgeClass, 'has badge class')
        t.end()
      })
  })

  test('--close--', function (t) {
    db.close(), t.end()
  })

})
