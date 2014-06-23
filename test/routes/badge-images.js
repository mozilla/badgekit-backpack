const test = require('tap').test
const prepare = require('./')

prepare({db: true}).then(function(api) {
  test('GET /public/images/test', function (t) {
    api.get('/public/images/test')
      .then(function (res) {
        t.same(res.statusCode, 200)
        t.same(res.headers['etag'], 'test')
        t.same(res.headers['content-type'], 'image/png')
        t.end()
      })
  })

  test('--close--', api.finish.bind(api))
})
