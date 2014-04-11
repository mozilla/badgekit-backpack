const Promise = require('bluebird')
const Earners = require('../models/earners')
const EarnerData = require('../models/earner-data')

module.exports = function earnerRoutes(server) {
  server.post('/users', createEarner)
  function createEarner(req, res, next) {
    const id = req.body.id
    const metadata = req.body.metadata
    const metadataRows = Object.keys(metadata).map(function (key) {
      return {
        earnerId: id,
        key: key,
        value: metadata[key]
      }
    })

    const putRow = function (row) { return EarnerData.put(row) }

    Earners.put({id: id})
      .then(function(result) {
        return Promise.all(metadataRows.map(putRow))
      })

      .then(function(results) {
        return Earners.getOne({id: id}, {relationships: true})
      })

      .then(function(earner) {
        res.header('Location', '/users/' + id)
        return res.send(201, earner.toResponse())
      })

      .catch(function (error) {
        req.log.error(error, 'POST /users: Error creating new earner')
        return next()
      })
  }
}
