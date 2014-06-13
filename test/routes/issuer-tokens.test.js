const test = require('tap').test;
const prepare = require('./');
const fixtures = require('../models/fixtures');
const startBadgeServer = require('./fake-badges')

// taken from the fixtures
const ISSUER_KEY = 'widgets';
const ISSUER_SECRET = 'shhsecret';

prepare({db: true}).then(function(api) {
  test('Basic API auth', function (t) {

    setKey(ISSUER_KEY);
    setSecret(ISSUER_SECRET);

    api.get('/auth-test')
      .then(function (res) {
        t.same(res.body, ISSUER_KEY, 'has right key');

        setSecret('wrong-secret');

        return api.get('/auth-test');
      })
      .then(function (res) {
        t.same(res.statusCode, 403, 'returns HTTP 403');
        t.end();
      })
  })

  test('Issuing badges', function (t) {
    setKey(ISSUER_KEY);
    setSecret(ISSUER_SECRET);

    startBadgeServer().then(function(server) {
      const baseUrl = server.fullUrl
      const form = {assertionUrl: baseUrl + '/assertion.json'}
      api.post('/users/test-user/badges', form)
        .then(function(res) {
          const location = res.headers.location
          t.same(res.statusCode, 201, 'has HTTP 201 created')
          t.ok(location.indexOf('/users/test-user/badges/') > -1, 'right location')
          server.close()

          const path = location.slice(location.indexOf('/users/'))
          return api.get(path)
        })
        .then(function (res) {
          t.same(res.statusCode, 403, 'should be forbidden')
          t.end();
        })
    })
  })


  test('--close--', api.finish.bind(api));
})

function setKey(key) {
  process.env.MASTER_KEY = key;
}
function setSecret(secret) {
  process.env.MASTER_SECRET = secret;
}
