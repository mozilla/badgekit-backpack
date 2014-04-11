const restify = require('restify')
const Promise = require('bluebird')
const Earners = require('../models/earners')
const EarnerData = require('../models/earner-data')

const NotFoundError = restify.NotFoundError

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

      .catch(res.logInternalError('POST /users – Error creating new earner'))
  }

  server.del('/users/:userId', deleteEarner)
  function deleteEarner(req, res, next) {
    const id = req.params.userId
    const query = {id: id}
    Earners.getOne(query)
      .then(function(earner) {
        if (!earner)
          throw new NotFoundError('Could not find earner with id `' + req.params.userId + '`')

        return Earners.del(query, {limit: 1})
      })

      .then(function(result) {
        return res.send(200, {status: 'deleted'})
      })

      .catch(NotFoundError, next)

      .catch(res.logInternalError('DELETE /users/:userId – Error deleting user'))
  }
}
