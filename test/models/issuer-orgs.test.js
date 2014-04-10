const test = require('tap').test
const prepare = require('./')
const IssuerOrgs = require('../../models/issuer-orgs')

prepare().then(function (db) {
  test('Sanity test', function (t) {
    const data = {
      id: 100,
      jsonUrl: 'http://example.org/one',
      name: 'Example Issuer',
      url: 'http://example.org',
    }
    IssuerOrgs.put(data)
      .then(function(result) {
        return IssuerOrgs.getOne({id: 100}, {relationships: true})
      })
      .then(function(issuer) {
        t.ok(issuer.createdOn, 'has created on date')
        t.same(issuer.json.url, issuer.jsonUrl, 'joined properly')
        t.same(issuer.name, data.name, 'right name')
        t.end()
      })
  })

  test('--close--', function (t) {
    db.close(), t.end()
  })
})
