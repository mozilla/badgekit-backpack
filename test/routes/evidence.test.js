const test = require('tap').test
const prepare = require('./')

prepare({db: true}).then(function(api) {
  test('POST /users/:userId/evidence', function (t) {
    const form = {
      description: 'A tiny little webpage',
      content: Buffer('<html><a href="://example.org">oh hi</a></html>').toString('base64'),
      contentType: 'text/html'
    }
    api.post('/users/test-user/evidence', form)
      .then(function(res) {
        const privateUrl = res.body.privateUrl
        const publicUrl = res.body.publicUrl
        t.same(res.statusCode, 201)
        t.ok(privateUrl.indexOf('/users/test-user/evidence/') > -1, 'has private url')
        t.ok(publicUrl.indexOf('/evidence/') > -1, 'has public url')
        t.end()
      })
  })

  test('GET evidence urls', function (t) {
    var content, contentType
    api.get('/users/test-user/evidence/1')
      .then(function(res) {
        t.same(res.statusCode, 200, 'has 200 OK')
        t.ok(res.body.slug, 'has slug')
        t.ok(res.body.createdOn, 'has createdOn')
        t.ok(res.body.description, 'has description')
        t.ok(res.body.content, 'has content')
        t.ok(res.body.contentType, 'has content-type')

        content = res.body.content
        contentType = res.body.contentType

        return api.get('/evidence/' + res.body.slug)
      })

      .then(function(res) {
        t.same(Buffer(res.body).toString('base64'), content, 'correct content')
        t.same(res.headers['content-type'], contentType, 'correct content type')
        t.end()
      })
  })

  test('DELETE /users/:userId/evidence/:evidenceId', function (t) {
    api.del('/users/test-user/evidence/1')
      .then(function(res) {
        t.same(res.statusCode, 200)
        return api.del('/users/test-user/evidence/1')
      })

      .then(function(res) {
        t.same(res.statusCode, 404)
        t.end()
      })
  })

  test('--close--', api.finish.bind(api))
})
