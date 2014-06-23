const package = require('../package')
const earners = require('./earners')
const badgeImages = require('./badge-images')

module.exports = function applyRoutes(server) {
  server.get('/', function (req, res) {
    return res.send({
      name: package.name,
      version: package.version,
    });
  })

  server.get('/auth-test', function (req, res) {
    res.send(req.authKey);
  })

  ;[earners,
    badgeImages].forEach(callWith(server))
}

function callWith(param) {
  return function (fn) { return fn(param) }
}
