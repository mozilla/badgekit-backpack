module.exports = verify;

const Promise = require('bluebird');
const request = require('request');
const util = require('util');

const AUDIENCE = process.env['HOST'];

if (!AUDIENCE)
  throw new Error('Must have a `HOST` environment variable set');

function verify(assertion) {
  return new Promise(function (resolve, reject) {
    request.post('https://verifier.login.persona.org/verify', {
      json: true,
      form: {
        assertion: assertion,
        audience: AUDIENCE
      }
    }, function (err, res, body) {
      if (err)
        return reject(err);

      if (body.status != 'okay')
        return reject(new Error(util.format('could not verify: %j', body)));

      if (body.audience != AUDIENCE)
        return reject(new Error('could not verify, invalid audience'));

      return resolve(body.email);
    });
  });
}

verify.audience = AUDIENCE;
