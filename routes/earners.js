const http = require('http')
const https = require('https')
const restify = require('restify')
const Promise = require('bluebird')
const request = require('request')
const bakery = require('openbadges-bakery')
const sha1 = require('../lib/hash').sha1
const JSONModel = require('../models/json')
const Evidence = require('../models/evidence')
const Earners = require('../models/earners')
const EarnerData = require('../models/earner-data')
const IssuerOrgs = require('../models/issuer-orgs')
const BadgeClasses = require('../models/badge-classes')
const EarnerBadges = require('../models/earner-badges')
const BadgeImages = require('../models/badge-images')

const NotFoundError = restify.NotFoundError
const BadRequestError = restify.BadRequestError
const keys = Object.keys

module.exports = function earnerRoutes(server) {
  server.post('/users', createEarner)
  function createEarner(req, res, next) {
    const id = req.body.id
    const under13 = req.body.under13
    const metadata = req.body.metadata || {}
    const metadataRows = keys(metadata).map(function (key) {
      return {
        earnerId: id,
        key: key,
        value: metadata[key]
      }
    })

    const putRow = function (row) { return EarnerData.put(row) }

    Earners.put({id: id, under13: under13 })
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
        const response = earner.toResponse(req)
        return res.send(200, response)
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

  server.get('/users/:userId/evidence', findAllEvidence)
  function findAllEvidence(req, res, next) {
    const earnerId = req.params.userId
    Earners.getOne({id: earnerId})
      .then(function(earner) {
        if (!earner)
          throw new NotFoundError('Could not find earner with id `' + earnerId + '`')
        return Evidence.get({earnerId: earnerId}, {exclude: ['content']})
      })

      .then(function(evidenceList) {
        res.send(200, evidenceList)
      })
      .catch(NotFoundError, next)
      .catch(res.logInternalError('GET /users/:userId/evidence'))
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
      .catch(res.logInternalError('GET /users/:userId/evidence/:evidenceId'))
  }

  server.del('/users/:userId/evidence/:evidenceId', deleteEvidence)
  function deleteEvidence(req, res, next) {
    const earnerId = req.params.userId
    const evidenceId = req.params.evidenceId
    Evidence.del({earnerId: earnerId, id: evidenceId}, {limit: 1})
      .then(function(result) {
        if (!result.affectedRows)
          throw new NotFoundError('Could not find evidence for user `' + earnerId  + '` with id `' + evidenceId + '`')
        return res.send(200, {status: 'deleted'})
      })
      .catch(NotFoundError, next)
      .catch(res.logInternalError('DEL /users/:userId/evidence/:evidenceId'))
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
      .catch(res.logInternalError('GET /evidence/:slug'))

  }

  // Badges
  // --------
  server.get('/users/:userId/badges', findEarnerBadges)
  function findEarnerBadges(req, res, next) {
    const earnerId = req.params.userId
    const options = {
      relationships: true,
      relationshipsDepth: 2,
    }
    Earners.getOne({id: earnerId})
      .then(function(earner) {
        if (!earner)
          throw new NotFoundError('Could not find earner with id `' + earnerId + '`')
        return EarnerBadges.get({earnerId: earnerId}, options)
      })

      .then(function(badges) {
        return res.send(200, badges)
      })

      .catch(NotFoundError, next)
      .catch(res.logInternalError('GET /users/:userId/badges'))
  }

  server.get('/users/:userId/badges/:badgeId', findEarnerBadge)
  function findEarnerBadge(req, res, next) {
    const earnerId = req.params.userId
    const badgeId = req.params.badgeId
    const options = {relationships: true}
    Earners.getOne({id: earnerId})
      .then(function(earner) {
        if (!earner)
          throw new NotFoundError('Could not find earner with id `' + earnerId + '`')

        const query = {
          id: badgeId,
          earnerId: earnerId,
        }
        return EarnerBadges.getOne(query, options)
      })

      .then(function(badge) {
        if (!badge)
          throw new NotFoundError('Could not find badge with id `' + badgeId + '`')
        const response = EarnerBadges.toResponse(badge, req)
        return res.send(200, response)
      })

      .catch(NotFoundError, next)
      .catch(res.logInternalError('GET /users/:userId/badges'))
  }

  server.del('/users/:userId/badges/:badgeId', deleteEarnerBadge)
  function deleteEarnerBadge(req, res, next) {
    const earnerId = req.params.userId
    const badgeId = req.params.badgeId
    EarnerBadges.del({ id: badgeId, earnerId: earnerId, }, {limit: 1})
      .then(function(result) {
        if (!result.affectedRows)
          throw new NotFoundError('Could not find badge for user `' + earnerId  + '` with id `' + badgeId + '`')
        return res.send(200, {status: 'deleted'})
      })
      .catch(NotFoundError, next)
      .catch(res.logInternalError('GET /users/:userId/badges'))
  }

  server.post('/users/:userId/badges', addEarnerBadge)
  function addEarnerBadge(req, res, next) {
    const form = req.body
    const earnerId = req.params.userId
    const assertionUrl = form.assertionUrl
    var structures
    var badgeImageSlug
    Earners.getOne({id: earnerId})
      .then(function(earner) {
        if (!earner)
          throw new NotFoundError('Could not find earner with id `' + earnerId + '`')
        return getAllBadgeStructures(assertionUrl, earnerId)
      })
      .then(function (_structures) {
        structures = _structures
        return getAndBakeImage(structures.badge.image, structures.assertion)
      })
      .then(function (imageData) {
        const encodedImageData = imageData.toString('base64')
        badgeImageSlug = sha1(encodedImageData)
        return BadgeImages.put({
          slug: badgeImageSlug,
          contentType: 'image/png',
          data: encodedImageData,
        })
      })
      .then(function (result) {
        structures.imageSlug = badgeImageSlug
        return structures
      })
      .then(saveBadgeStructures)
      .then(function(earnerBadge) {
        res.header('Location', req.resolvePath('/users/' + earnerId + '/badges/' + earnerBadge.id))
        return res.send(201, {status: 'created'})
      })
      .catch(BadRequestError, next)
      .catch(next)
  }

}

function getAllBadgeStructures(assertionUrl, earnerId) {
  return new Promise(function (resolve, reject) {
    const httpGet = Promise.promisify(request.get)
    const results = {earnerId: earnerId}
    httpGet(assertionUrl)
      .spread(function (res, body) {
        var assertion
        if (res.statusCode != 200)
          throw new BadRequestError('Could not get assertion structure: Expected HTTP 200, got HTTP ' + res.statusCode)

        try {
          assertion = JSON.parse(body)
        } catch (e) {
          throw new BadRequestError('Could not get parse assertion structure as JSON')
        }

        if (!assertion.badge)
          throw new BadRequestError('Assertion is missing `badge` field')

        results.assertion = assertion
        results.assertionUrl = assertionUrl
        results.badgeUrl = assertion.badge

        return httpGet(assertion.badge)
      })

      .spread(function (res, body) {
        var badge
        if (res.statusCode != 200)
          throw new BadRequestError('Could not get badge structure: Expected HTTP 200, got HTTP ' + res.statusCode)

        try {
          badge = JSON.parse(body)
        } catch (e) {
          throw new BadRequestError('Could not get parse badge structure as JSON')
        }

        if (!badge.issuer)
          throw new BadRequestError('Badge is missing `issuer` field')

        results.badge = badge
        results.issuerUrl = badge.issuer
        return httpGet(results.issuerUrl)
      })

      .spread(function (res, body) {
        var issuer
        if (res.statusCode != 200)
          throw new BadRequestError('Could not get issuer structure: Expected HTTP 200, got HTTP ' + res.statusCode)

        try {
          issuer = JSON.parse(body)
        } catch (e) {
          throw new BadRequestError('Could not get parse issuer structure as JSON')
        }

        results.issuer = issuer
        return resolve(results)
      })
      .catch(reject)
  })
}

function getStream(url) {
  const get = (url.indexOf('https') == 0)
      ? https.get
      : http.get
  return new Promise(function (resolve, reject) {
    var req = get(url, function (res) { return resolve(res) })
    req.on('error', function (err) { return reject(err) })
  })
}

function getAndBakeImage(url, assertion) {
  const bake = Promise.promisify(bakery.bake)
  return getStream(url)
    .then(function (stream) {
      return bake({
        image: stream,
        assertion: assertion,
      })
    })
}

function saveBadgeStructures(structs) {
  const saveJSON = function (data) { return JSONModel.put(data) }
  const getOrPut = function (model, data) {
    const promise = model.getOne({jsonUrl: data.jsonUrl})
      .then(function(item) {
        if (!item)
          return model.put(data)
        return { insertId: item.id }
      })
      .then(function(result) {
        return result.insertId
      })
    return promise
  }
  const rows = [
    {url: structs.issuerUrl, data: JSON.stringify(structs.issuer) },
    {url: structs.badgeUrl, data: JSON.stringify(structs.badge) },
    {url: structs.assertionUrl, data: JSON.stringify(structs.assertion) },
  ]
  return Promise.all(rows.map(saveJSON))
    .then(function(results) {
      const issuer = structs.issuer
      return getOrPut(IssuerOrgs, {
        jsonUrl: structs.issuerUrl,
        name: issuer.name,
        url: issuer.url,
        description: issuer.description,
        imageUrl: issuer.image,
        email: issuer.email,
        revocationList: issuer.revocationList,
      })
    })
    .then(function(issuerId) {
      const badge = structs.badge
      return getOrPut(BadgeClasses, {
        jsonUrl: structs.badgeUrl,
        issuerOrgId: issuerId,
        name: badge.name,
        description: badge.description,
        imageUrl: badge.image,
        criteriaUrl: badge.criteria,
        issuerJSONUrl: badge.issuer,
      })
    })
    .then(function(badgeId) {
      const assertion = structs.assertion
      return EarnerBadges.put({
        jsonUrl: structs.assertionUrl,
        earnerId: structs.earnerId,
        badgeClassId: badgeId,
        badgeImageSlug: structs.imageSlug,
        uid: assertion.uid,
        imageUrl: assertion.image,
        badgeJSONUrl: assertion.badge,
        evidenceUrl: assertion.evidence,
        issuedOn: assertion.issuedOn,
        evidenceUrl: assertion.evidence,
      }, {uniqueKey: 'jsonUrl'})
    })
    .then(function(dbResult) {
      return EarnerBadges.getOne({
        jsonUrl: structs.assertionUrl
      }, {
        relationships: true,
        relationshipsDepth: 2,
      })
    })
}
