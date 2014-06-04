const package = require('../package')
const earners = require('./earners')

module.exports = function applyRoutes(server) {
  server.get('/', function (req, res) {
    return res.send({
      name: package.name,
      version: package.version,
    });
  })

  ;[earners].forEach(callWith(server))
}

function callWith(param) {
  return function (fn) { return fn(param) }
}
