const urlUtil = require('url')
const http = require('http')
const Promise = require('bluebird')
const concat = require('concat-stream')
const server = require('../../')
const assert = require('assert')
const prepareDb = require('../models')

const spawn = module.exports = function spawn(opts) {
  return new Promise(function (resolve, reject) {
    server.listen(0, function (error) {
      if (error) throw error
      if (!opts.db)
        return resolve(new APIClient(server))
      prepareDb().then(function(db) {
        return resolve(new APIClient(server, db))
      })
    })
  })
}

function APIClient(server, db) {
  this.server = server
  this.prefix = 'http://127.0.0.1:' + server.address().port
  this.db = db
}

APIClient.prototype.get = requestWithoutBody('GET')
APIClient.prototype.del = requestWithoutBody('DELETE')
APIClient.prototype.post = requestWithBody('POST')
APIClient.prototype.put = requestWithBody('PUT')

APIClient.prototype.finish = function finish(t) {
  this.server.close()
  if (this.db)
    this.db.close()
  t.end()
}

function requestWithoutBody(method) {
  return function (urlSuffix) {
    const url = this.prefix + urlSuffix
    const result = {}
    const options = urlUtil.parse(url)
    options.method = method.toUpperCase()
    options.headers = { 'content-type': 'application/json' }
    return new Promise(function (resolve, reject) {
      const req = http.request(options, handleResponse(resolve, reject))
      req.end()
    })
  }
}

function requestWithBody(method) {
  return function (urlSuffix, formData) {
    const url = this.prefix + urlSuffix
    const options = urlUtil.parse(url)
    return new Promise(function (resolve, reject) {
      const jsonFormData = Buffer(JSON.stringify(formData))
      options.method = method.toUpperCase()
      options.headers = {
        'content-type': 'application/json',
        'content-length': jsonFormData.length,
        'warning': 'Contents Might Be Too Rad',
      }
      const req = http.request(options, handleResponse(resolve, reject))
      req.write(jsonFormData)
      req.end()
    })
  }
}

function handleResponse(resolve, reject) {
  return function (res) {
    const result = {}
    result.headers = res.headers
    result.statusCode = res.statusCode

    res.setEncoding('utf8')
    res.pipe(concat(function (data) {
      try { result.body = JSON.parse(data) }
      catch (err) { result.body = data }
      return resolve(result)
    }))

    res.on('error', function (error) {
      return reject(error)
    })
  }
}

if (!module.parent) {
  const test = require('tap').test
  function echo(req, res) {
    const response = {
      method: req.method,
      headers: req.headers,
      body: req.body || {}
    }
    res.send(response)
  }

  server.get('/echo', echo)
  server.del('/echo', echo)
  server.post('/echo', echo)
  server.put('/echo', echo)

  test('RUN SELF-DIAGNOSTIC', function (t) {
    spawn().then(function(api) {
      const body = {param: 'value'}

      const requests = [
        api.get('/echo'),
        api.post('/echo', body),
        api.put('/echo', body),
        api.del('/echo', body),
      ]

      Promise.all(requests).spread(function(get, post, put, del) {
        t.same(get.body.method, 'GET', 'get method ok')
        t.same(del.body.method, 'DELETE', 'del method ok')

        t.same(post.body.method, 'POST', 'post method ok')
        t.same(post.body.body, body, 'post body back')

        t.same(put.body.method, 'PUT', 'put method ok')
        t.same(put.body.body, body, 'put correct body')

        t.end()

        api.close()
      })
    })
  })

}
