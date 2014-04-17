const Faker = require('Faker')
const Promise = require('bluebird')
const http = require('http')
const concat = require('concat-stream')
function startFakeBadgeServer() {
  return new Promise(function (resolve, reject) {
    const server = http.createServer(function (req, res) {
      switch (req.url) {
       case '/assertion.json':
        return assertion(req, res)
        break;
       case '/badge.json':
        return badge(req, res)
        break;
       case '/issuer.json':
        return issuer(req, res)
        break;
      default:
        res.statusCode = 404
        res.write('NotFound')
        res.end()
      }
    }).listen(0, function (err) {
      if (err) throw err
      server.fullUrl = 'http://127.0.0.1:' + this.address().port
      return resolve(server)
    })
  })
}

function assertion(req, res) {
  res.end(JSON.stringify({
    uid: 'hallo',
    issuedOn: '2014-04-14',
    badge: 'http://' + req.headers.host + '/badge.json',
    recipient: {
      identity: Faker.Internet.email(),
      type: 'email',
      hashed: false,
    },
    verify: {
      type: 'hosted',
      url: 'http://' + req.headers.host + '/assertion.json',
    },
  }))
}

function badge(req, res) {
  res.end(JSON.stringify({
    name: 'lkajsdflsjf',
    description: Faker.Lorem.sentence(),
    image: Faker.Image.imageUrl(),
    criteria: 'http://example.org/criteria',
    issuer: 'http://' + req.headers.host + '/issuer.json',
  }))
}

function issuer(req, res) {
  res.end(JSON.stringify({
    name: Faker.Company.companyName(),
    url: 'http://' + Faker.Internet.domainName(),
  }))
}
module.exports = startFakeBadgeServer

if (!module.parent) {
  startFakeBadgeServer()
    .then(function(server) {
      http.get(server.fullUrl + '/issuer.json', function (res) {
        res.setEncoding('utf8')
        res.pipe(concat(function(body) {
          console.dir(body)
        }))
      })
    })
}
