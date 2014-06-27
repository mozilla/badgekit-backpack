module.exports = createAuthHeader;

const util = require('util');
const crypto = require('crypto');
const jws = require('jws');

/**
 * Create an authorization token suitable for providing as the
 * `Authorization` header for a given request.
 *
 * @param {Object} opts Object containing the following properties:
 *   method: The HTTP method of the outgoing request (e.g, 'POST')
 *   path: The relative path of the request, including the query string
 *     if there is one.
 *   body: The body of the request, if there is one. This can be omitted
 *     for methods that don't take a body. Must be provided as a buffer
 *     or a string.
 *   apiKey: (optional) API key to use. Falls back to `API_KEY`
 *     environment variable, defaults to "master"
 *   apiSecret: (optional) Secret to sign the token with. Falls back to
 *     `API_SECRET` environment variable.
 *
 * @return Authorization token
 */

function createAuthHeader(opts) {
  const apiKey = opts.apiKey || process.env.API_KEY || 'master';
  const apiSecret = opts.apiSecret || process.env.API_SECRET;

  const payload = {
    key: apiKey,
    method: opts.method,
    path: opts.path,
  };

  if (opts.body) {
    payload.body = {
      alg: 'sha256',
      hash: sha256(Buffer(opts.body)),
    };
  }

  return util.format('JWT token="%s"', jws.sign({
    secret: apiSecret,
    header: {typ: 'JWT', alg: 'HS256'},
    payload: payload,
  }));
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}
