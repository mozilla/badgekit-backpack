/*global describe, it*/
const assert = require('assert');
const APIClient = require('../lib/api-client');

describe('API Client', function () {
  describe('constructor', function () {

    it('throws when missing secret', function () {
      assert.throws(function() {
        new APIClient({ host: 'lol' });
      }, /secret/i);
    });

    it('throws when missing host', function () {
      assert.throws(function() {
        new APIClient({ secret: 'lol' });
      }, /host/i);
    });

    it('throws when given a really bad host', function () {
      assert.throws(function() {
        new APIClient({ secret: 'lol', host: new Error('this is bad') });
      }, /host/i);
    });

    it('throws when given a host that is not a URL', function () {
      assert.throws(function() {
        new APIClient({ secret: 'lol', host: 'not a url' });
      }, /host/i);
    });

  });

  it('#getAllBadges', function () {
    assert.throws(function() {
      new APIClient({ host: 'lol' });
    }, /secret/i);
  });

  testWithServer('#getOneBadge', function (host, done) {
    const client = new APIClient({
      host: host,
      secret: 'nick arcade',
    });

    client.getOneBadge({user: 'brian@example.org', badgeId: '418'})
      .then(function (r) {
        headersOk(r.headers);
        assert.equal(r.method, 'GET');
        assert.equal(r.path, '/user/brian@example.org/badges/418');
        done();
      })
      .catch(done);
  });

  testWithServer('#deleteBadge', function (host, done) {
    const client = new APIClient({
      host: host,
      secret: 'global guts',
    });

    client.deleteBadge({user: 'brian@example.org', badgeId: '418'})
      .then(function (r) {
        headersOk(r.headers);
        assert.equal(r.method, 'DELETE');
        assert.equal(r.path, '/user/brian@example.org/badges/418');
        done();
      })
      .catch(done);
  });

  testWithBadServer('should handle bad response', function (host, done) {
    const client = new APIClient({
      host: host,
      secret: 'double dare',
    });

    client.getAllBadges({ user: 'brian@example.org' })
      .then(function () {
        done(new Error('should not hit the success handler'));
      })
      .catch(APIClient.BadResponse, function (error) {
        assert.ok(error.statusCode > 400);
        done()
      })
  })
});

function headersOk(headers) {
  assert.ok(headers.authorization)
  assert.equal(headers['content-type'], 'application/json');
}


function testWithServer(name, test) {
  it(name, function (done) {
    dummyServer(null, function (err, server) {
      const serverUrl = 'http://127.0.0.1:' + server.address().port;
      test(serverUrl, function (err) {
        server.close();
        done(err);
      })
    })
  })
}
function testWithBadServer(name, test) {
  it(name, function (done) {
    dummyServer({statusCode: 500}, function (err, server) {
      const serverUrl = 'http://127.0.0.1:' + server.address().port;
      test(serverUrl, function (err) {
        server.close();
        done(err);
      })
    })
  })
}

function dummyServer(opts, callback) {
  opts = opts || {};
  const concat = require('concat-stream');
  const http = require('http');
  const server = http
    .createServer(requestHandler)
    .listen(0, listenHandler);

  function requestHandler(req, res) {
    req.setEncoding('utf8');
    req.pipe(concat(function (data) {
      const result = {
        method: req.method,
        path: req.url,
        headers: req.headers,
      }
      if (data.length)
        result.body = data;
      res.statusCode = opts.statusCode || 200;
      res.write(JSON.stringify(result));
      res.end();
    }))
  }

  function listenHandler(err) {
    if (err) return callback(err);
    return callback(null, server);
  }
}
