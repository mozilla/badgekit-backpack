const test = require('tap').test
const prepare = require('./')
const Evidence = require('../../models/evidence')

prepare().then(function (db) {
  test('Sanity test', function (t) {
    const data = {
      id: 100,
      earnerId: 'test-user',
      content: 'hi',
      slug: 'unique-slug',
    }
    Evidence.put(data)
      .then(function (evidence) {
        return Evidence.getOne({id: 100})
      })

      .then(function(evidence) {
        t.same(evidence.id, data.id, 'has right id')
        t.ok(evidence.createdOn, 'has createdOn date')
        t.same(evidence.contentType, 'text/plain', 'has text/plain contentType date')
        return Evidence.del({id: 100})
      })

      .then(function(result) {
        t.same(result.affectedRows, 1, 'deletes 1 row')
        return Evidence.getOne({id: 100})
      })

      .then(function(evidence) {
        t.notOk(evidence, 'does not find evidence')
        t.end()
      })
  })

  test('--close--', function (t) {
    db.close(), t.end()
  })

})
