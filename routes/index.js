const package = require('../package')
module.exports = function applyRoutes(server) {
  server.get('/', function (req, res) {
    return res.send({
      name: package.name,
      version: package.version,
    });
  })
}
