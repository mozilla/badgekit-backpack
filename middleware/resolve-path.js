const url = require('url')

module.exports = function attachResolvePath() {
  return function (req, res, next) {
    req.resolvePath = function resolve(path) {
      return url.format({
        protocol: req.isSecure() ? 'https:' : 'http:',
        host: req.headers.host || '',
        pathname: url.resolve(req.url, path || ''),
      })
    }
    return next()
  }
}
