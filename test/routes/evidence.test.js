const test = require('tap').test
const prepare = require('./')

const TEST_USER = process.env['TEST_USER'] || 'test-user';

prepare({db: true}).then(function(api) {
  test('GET /users/:userId/evidence', function (t) {
    api.get('/users/' + TEST_USER + '/evidence')
      .then(function(res) {
        t.same(res.statusCode, 200, 'good status')
        t.ok(Array.isArray(res.body), 'body is an array')
        t.ok(res.body.length >= 3, 'has a few results (from the fixtures)')
        t.end()
      })
  })

  test('POST /users/:userId/evidence', function (t) {
    const form = {
      description: 'A tiny little webpage',
      content: Buffer('<html><a href="://example.org">oh hi</a></html>').toString('base64'),
      contentType: 'text/html'
    }
    api.post('/users/' + TEST_USER + '/evidence', form)
      .then(function(res) {
        const privateUrl = res.body.privateUrl
        const publicUrl = res.body.publicUrl
        t.same(res.statusCode, 201)
        t.ok(privateUrl.indexOf('/users/' + TEST_USER + '/evidence/') > -1, 'has private url')
        t.ok(publicUrl.indexOf('/evidence/') > -1, 'has public url')
        t.end()
      })
  })

  test('GET /users/:userId/evidence/:evidenceId', function (t) {
    var content, contentType
    api.get('/users/' + TEST_USER + '/evidence/101')
      .then(function(res) {
        t.same(res.statusCode, 200, 'has 200 OK')
        t.ok(res.body.slug, 'has slug')
        t.ok(res.body.createdOn, 'has createdOn')
        t.ok(res.body.description, 'has description')
        t.ok(res.body.content, 'has content')
        t.ok(res.body.contentType, 'has content-type')
        t.end()
      })
  })

  test('GET /evidence/:evidenceSlug', function (t) {
    api.get('/evidence/hi-test')
      .then(function(res) {
        t.same(res.statusCode, 200, 'good status')
        t.same(res.body, 'hi', 'good body')
        t.end()
      })
  })


  test('DELETE /users/:userId/evidence/:evidenceId', function (t) {
    api.del('/users/' + TEST_USER + '/evidence/100')
      .then(function(res) {
        t.same(res.statusCode, 200)
        return api.del('/users/' + TEST_USER + '/evidence/100')
      })

      .then(function(res) {
        t.same(res.statusCode, 404)
        t.end()
      })
  })

  test('--close--', api.finish.bind(api))
})
