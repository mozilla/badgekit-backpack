const test = require('tap').test
const prepare = require('./')

const earnerData = {
  id: 'brian@mozillafoundation.org',
  metadata: {
    age: 28,
    sign: 'Leo',
    birthday: '1985-08-13',
  }
}

prepare({db: true}).then(function(api) {
  test('POST /users', function (t) {
    const form = earnerData

    api.post('/users', form)
      .then(function(res) {
        t.same(res.statusCode, 201)
        t.same(res.body.metadata, form.metadata)
        t.end()
      })
  })

  test('GET /users/:userId', function (t) {
    api.get('/users/brian@mozillafoundation.org')
      .then(function(res) {
        t.same(res.statusCode, 200)
        t.same(res.body.metadata, earnerData.metadata)
        t.end()
      })
  })

  test('PUT /users/:userId', function (t) {
    const update = {
      age: '∞',
      sign: null,
      birthday: null,
    }
    api.put('/users/brian@mozillafoundation.org', update)
      .then(function(res) {
        t.same(res.statusCode, 200)
        return api.get('/users/brian@mozillafoundation.org')
      })

      .then(function(res) {
        t.same(res.body.metadata, {age: '∞'})
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
