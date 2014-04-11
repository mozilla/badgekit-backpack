const test = require('tap').test
const prepare = require('./')

prepare({db: true}).then(function(api) {
  test('POST /users', function (t) {
    const form = {
      id: 'brian@mozillafoundation.org',
      metadata: {
        age: 28,
        sign: 'Leo',
        birthday: '1985-08-13',
      }
    }

    api.post('/users', form)
      .then(function(res) {
        t.same(res.statusCode, 201)
        t.same(res.body.metadata, form.metadata)
        t.end()
      })
  })

  test('DELETE /users/:userId', function (t) {
    api.del('/users/delete-me')
      .then(function(res) {
        t.same(res.statusCode, 200)
        t.same(res.body.status, 'deleted' )
        return api.del('/users/delete-me')
      })

      .then(function(res) {
        t.same(res.body.code, 'NotFoundError')
        t.same(res.statusCode, 404)
        t.end()
      })

  })

  test('--close--', api.finish.bind(api))
})
