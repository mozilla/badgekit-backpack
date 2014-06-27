/*global describe, it, before*/
const createAuthToken = require('../lib/api-authorization');
const assert = require('assert');

describe('API Authorization module', function () {

  it('should pass basic sanity checks', function () {
    const token = createAuthToken({
      path: '/lol',
      method: 'GET',
      apiSecret: 'shhhh',
    });
    assert.ok(token);
    assert.ok(/JWT token=".+?"/.test(token));
  });


  it('should fail if there is no secret', function () {
    assert.throws(function() {
      const token = createAuthToken({
        path: '/lol',
        method: 'GET',
      });
    });
  });


  it('should fall back to environment if secret is passed', function () {
    const secret = 'shh';

    process.env.API_SECRET = secret;

    const explicitToken = createAuthToken({
      path: '/lol',
      method: 'GET',
      apiSecret: secret,
    });

    const implicitToken = createAuthToken({
      path: '/lol',
      method: 'GET',
    });

    assert.equal(explicitToken, implicitToken);
  });

});
