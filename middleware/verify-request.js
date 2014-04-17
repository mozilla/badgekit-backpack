const jws = require('jws')
const hash = require('../lib/hash').hash
const ForbiddenError = require('restify').ForbiddenError

module.exports = function verifyRequest() {
  return function (req, res, next) {
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

    const masterSecret = process.env.MASTER_SECRET
    if (!jws.verify(token, masterSecret))
      return next(new ForbiddenError('Invalid token signature'))
    return success()

    function success() {
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
