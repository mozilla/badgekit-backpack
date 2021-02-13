const Promise = require('bluebird')
const bakery = require('openbadges-bakery')
const test = require('tap').test
const prepare = require('./')
const startBadgeServer = require('./fake-badges')

const getDataFromBakedBadge = Promise.promisify(bakery.debake)

const TEST_USER = process.env['TEST_USER'] || 'test-user';

prepare({db: true}).then(function(api) {
  test('GET /users/:userId/badges', function (t) {
    api.get('/users/' + TEST_USER + '/badges')
      .then(function(res) {
        t.ok(res.body.length >= 1, 'gets back some badges')
        t.end()
      })
  })

  test('GET /users/:userId/badges', function (t) {
    api.get('/users/' + TEST_USER + '/badges')
      .then(function(res) {
        t.ok(res.body.length >= 1, 'gets back some badges')
        t.end()
      })
  })

  test('POST /users/:userId/badges', function (t) {
    startBadgeServer().then(function(server) {
      const baseUrl = server.fullUrl
      const form = {assertionUrl: baseUrl + '/assertion.json'}
      api.post('/users/' + TEST_USER + '/badges', form)
        .then(function(res) {
          const location = res.headers.location
          const relativeLocation = location.slice(location.indexOf('/users/'))
          t.same(res.statusCode, 201, 'has HTTP 201 created')
          t.ok(location.indexOf('/users/' + TEST_USER + '/badges/') > -1, 'right location')
          return api.get(relativeLocation)
        })
        .then(function (res) {
          const location = res.body.bakedBadgeUrl
          const relativeLocation = location.slice(location.indexOf('/public/'))
          return api.get(relativeLocation, {buffer: true})
        })
        .then(function (res) {
          return getDataFromBakedBadge(res.body)
        })
        .then(function (data) {
          t.ok(data, 'as long as there is something here we are good')
          server.close(), t.end()
        })

    })
  })

  test('GET /users/:userId/badges/:badgeId', function (t) {
    api.get('/users/' + TEST_USER + '/badges/1')
      .then(function(res) {
        t.same(res.statusCode, 200, 'has HTTP 200')
        t.same(res.body.id, 1, 'right badge')
        t.end()
      })
  })

  test('DELETE /users/:userId/badges/:badgeId', function (t) {
    api.del('/users/' + TEST_USER + '/badges/1')
      .then(function(res) {
        t.same(res.statusCode, 200, 'has HTTP 200')
        return api.get('/users/' + TEST_USER + '/badges/1')
      })
      .then(function(res) {
        t.same(res.statusCode, 404, 'should not find badge')
        t.end()
      })
  })

  test('--close--', api.finish.bind(api))
})
