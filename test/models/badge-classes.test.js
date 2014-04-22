const test = require('tap').test
const prepare = require('./')
const BadgeClasses = require('../../models/badge-classes')

prepare().then(function (db) {
  test('Sanity test', function (t) {
    const data = {
      id: 100,
      jsonUrl: 'http://example.org/2',
      issuerOrgId: 1,
      name: 'Example Badge Class',
      description: 'I AM ERROR',
      imageUrl: 'http://example.org/image.png',
      criteriaUrl: 'http://example.org/criteria',
      issuerJSONUrl: 'http://example.org/issuer.json',
    }
    BadgeClasses.put(data)
      .then(function(result) {
        return BadgeClasses.getOne({id: 100}, {relationships: true})
      })
      .then(function(badgeClass) {
        t.ok(badgeClass.json, 'has json')
        t.ok(badgeClass.issuer, 'has issuer')
        t.ok(badgeClass.createdOn, 'has created on')
        t.end()
      })
  })

  test('--close--', function (t) {
    db.close(), t.end()
  })
})
