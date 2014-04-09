const test = require('tap').test
const prepare = require('./')
const Earners = require('../../models/earners')

prepare().then(function (db) {
  test('Sanity test', function (t) {
    const data = {id: 'some-user-identification'}

    Earners.put(data)
      .then(function (earner) {
        return Earners.getOne(data)
      })

      .then(function(earner) {
        t.same(earner.id, data.id, 'should have right id')
        t.ok(earner.createdOn, 'should have createdOn date')
        return Earners.del(data)
      })

      .then(function(result) {
        t.same(result.affectedRows, 1, 'should delete 1 row')
        return Earners.getOne(data)
      })

      .then(function(earner) {
        t.notOk(earner, 'should not find an earner')
        t.end()
      })
  })

  test('--close--', function (t) {
    db.close(), t.end()
  })
})
