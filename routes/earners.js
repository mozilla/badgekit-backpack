const restify = require('restify')
const Promise = require('bluebird')
const sha1 = require('../lib/hash').sha1
const Evidence = require('../models/evidence')
const Earners = require('../models/earners')
const EarnerData = require('../models/earner-data')

const NotFoundError = restify.NotFoundError
const keys = Object.keys


module.exports = function earnerRoutes(server) {
  server.post('/users', createEarner)
  function createEarner(req, res, next) {
    const id = req.body.id
    const metadata = req.body.metadata
    const metadataRows = keys(metadata).map(function (key) {
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

  server.get('/users/:userId', findEarner)
  function findEarner(req, res, next) {
    const id = req.params.userId
    Earners.getOne({id: id}, {relationships: true})
      .then(function(earner) {
        if (!earner)
          throw new NotFoundError('Could not find earner with id `' + req.params.userId + '`')
        return res.send(200, earner.toResponse())
      })

      .catch(NotFoundError, next)
      .catch(res.logInternalError('DELETE /users/:userId – Error deleting user'))
  }

  server.put('/users/:userId', updateEarner)
  function updateEarner(req, res, next) {
    const id = req.params.userId
    const metadata = req.body

    Earners.getOne({id: id}, {relationships: true})
      .then(function(earner) {
        if (!earner)
          throw new NotFoundError('Could not find earner with id `' + req.params.userId + '`')

        return Promise.all(keys(metadata).map(function (key) {
          const value = metadata[key]
          if (value === null) {
            return EarnerData.del({
              earnerId: id,
              key: key
            })
          }

          return EarnerData.put({
            earnerId: id,
            key: key,
            value: value,
          }, {uniqueKey: ['earnerId', 'key']})
        }))
      })

      .then(function(results) {
        return res.send(200, {status: 'updated'})
      })

      .catch(NotFoundError, next)
      .catch(res.logInternalError('DELETE /users/:userId – Error deleting user'))
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

  // Evidence
  // --------

  server.post('/users/:userId/evidence', createEvidence)
  function createEvidence(req, res, next) {
    const earnerId = req.params.userId
    const form = req.body
    const slug = sha1(Date.now() + earnerId + form.content)
    const modelData = {
      earnerId: earnerId,
      description: form.description,
      slug: sha1(Date.now() + earnerId + form.content),
      content: form.content,
      contentType: form.contentType,
    }
    Earners.getOne({id: earnerId})
      .then(function(earner) {
        if (!earner)
          throw new NotFoundError('Could not find earner with id `' + earnerId + '`')
        return Evidence.put(modelData)
      })

      .then(function(result) {
        const publicUrl = '/evidence/' + slug
        const privateUrl =
          '/users/' + earnerId + '/evidence/' + result.insertId
        res.header('Location', req.resolvePath(privateUrl))
        return res.send(201, {
          status: 'created',
          privateUrl: req.resolvePath(privateUrl),
          publicUrl: req.resolvePath(publicUrl),
        })
      })

      .catch(NotFoundError, next)
      .catch(res.logInternalError('POST /users/:userId/evidence – Error creating new evidence for user'))
  }

  server.get('/users/:userId/evidence/:evidenceId', findEvidence)
  function findEvidence(req, res, next) {
    const earnerId = req.params.userId
    const evidenceId = req.params.evidenceId
    Evidence.getOne({earnerId: earnerId, id: evidenceId})
      .then(function(evidence) {
        if (!evidence)
          throw new NotFoundError('Could not find evidence for user `' + earnerId  + '` with id `' + evidenceId + '`')

        return res.send(200, {
          slug: evidence.slug,
          createdOn: evidence.createdOn,
          description: evidence.description,
          content: evidence.content,
          contentType: evidence.contentType,
        })
      })

      .catch(NotFoundError, next)
      .catch(res.logInternalError('POST /users/:userId/evidence – Error creating new evidence for user'))
  }

  server.get('/evidence/:slug', findEvidenceBySlug)
  function findEvidenceBySlug(req, res, next) {
    const slug = req.params.slug
    Evidence.getOne({slug: slug})
      .then(function(evidence) {
        if (!evidence)
          throw new NotFoundError('Could not find evidence with the slug `' + slug + '`')

        // Restify doesn't respect arbitrary content types when trying
        // to `send()` buffers. To avoid header re-writing, we use
        // `write` and `end` directly.
        res.setHeader('content-type', evidence.contentType)
        res.write(Buffer(evidence.content, 'base64'))
        res.end()
      })

      .catch(NotFoundError, next)
      .catch(res.logInternalError('POST /users/:userId/evidence – Error creating new evidence for user'))

  }

}
