const test = require('tap').test
const prepare = require('./')
const JSONModel = require('../../models/json')

prepare().then(function (db) {
  test('Sanity test', function (t) {
    const data = {
      url: 'http://example.com',
      data: '{"hi":"<3"}',
    }
    JSONModel.put(data)
      .then(function(result) {
        return JSONModel.getOne({url: data.url})
      })
      .then(function(json) {
        t.same(json.url, data.url)
        t.same(json.data, data.data)
        t.ok(json.updatedOn, 'has updated on')
        return JSONModel.del({url: data.url})
      })
      .then(function(result) {
        return JSONModel.getOne({url: data.url})
      })
      .then(function(json) {
        t.notOk(json)
        t.end()
      })
  })

  test('--close--', function (t) {
    db.close(), t.end()
  })

})
