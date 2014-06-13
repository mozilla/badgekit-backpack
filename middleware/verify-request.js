const jws = require('jws')
const hash = require('../lib/hash').hash
const IssuerTokens = require('../models/issuer-tokens')
const ForbiddenError = require('restify').ForbiddenError
const InternalServerError = require('restify').InternalServerError

module.exports = function verifyRequest() {
  return function (req, res, next) {
    const MASTER_SECRET = process.env.MASTER_SECRET

    if (req.url.indexOf('/evidence/') === 0)
      return next()

    if (req.url == '/' ||
        req.url == '/healthcheck')
      return next()

    const token = getAuthToken(req)
    if (!token)
      return next(new ForbiddenError('Missing valid Authorization header'))

    try {
      const parts = jws.decode(token) }
    catch (e) {
      req.log.warn({code: 'JWTDecodeError', token: token}, 'Could not decode JWT')
      return next(new ForbiddenError('Could not decode JWT'))
    }

    const auth = parts.payload
    if (!auth)
      return next(new ForbiddenError('Missing JWT payload'))

    if (!auth.method)
      return next(new ForbiddenError('Missing JWT claim: method'))

    if (''+auth.method.toUpperCase() !== req.method.toUpperCase())
      return next(new ForbiddenError('`method` does not match: using "'+auth.method+'" token for "'+req.method+'" request'))

    if (!auth.path)
      return next(new ForbiddenError('Missing JWT claim: path'))

    if (auth.path !== req.url)
      return next(new ForbiddenError('`path` does not match: trying to use token for "'+auth.path+'" on "'+req.url+'"'))

    const now = Date.now()/1000|0
    if (auth.exp && auth.exp <= now)
      return next(new ForbiddenError('Token is expired (token expiry: '+auth.exp+', server time: '+now))

    if (!(/^(GET|DELETE|HEAD)$/i.exec(req.method))) {
      if (!auth.body)
        return next(new ForbiddenError('Missing JWT claim: body'))

      if (!auth.body.alg)
        return next(new ForbiddenError('Missing JWT claim: body.alg'))

      if (!auth.body.hash)
        return next(new ForbiddenError('Missing JWT claim: body.hash'))

      const givenHash = auth.body.hash
      try {
        const computedHash = hash(auth.body.alg, Buffer(req._body))
      } catch (e) {
        return next(new ForbiddenError('Could not calculate hash, unsupported algorithm: '+auth.body.alg))
      }
      if (givenHash !== computedHash)
        return next(new ForbiddenError('Computed hash does not match given hash: '+givenHash+' != '+computedHash+''))
    }

    if (!auth.key)
      return next(new ForbiddenError('Missing JWT claim: key'))

    if (auth.key === 'master') {
      if (!jws.verify(token, MASTER_SECRET))
        return next(new ForbiddenError('Invalid token signature'))
      return success(auth.key)
    }

    IssuerTokens.getOne({key: auth.key})
      .then(function (credentials) {
        const secret = credentials.token;
        if (!jws.verify(token, secret))
          return next(new ForbiddenError('Invalid token signature'))

        if (req.url === '/auth-test')
          return success(auth.key)

        if (!(/^\/users\/.+?\/badges\/?$/.exec(req.url)))
          return next(new ForbiddenError('Issuer tokens can only send issue new badges'))
        return success(auth.key)
      })
      .catch(function (err) {
        req.log.error(err, 'Error interacting with database');
        return next(new InternalServerError('Could not connect to database'))
      })

    function success(key) {
      req.authKey = key;
      return next()
    }
  }
}

function getAuthToken(req) {
  const authHeader = req.headers.authorization
  if (!authHeader) return

  const match = authHeader.match(/^JWT token="(.+?)"$/)
  if (!match) return

  return match[1]
}
