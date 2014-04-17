if (process.env.NODE_ENV !== 'test') {
  console.log('Must be in test environment to continue')
  process.exit(1)
}

const fs = require('fs')
const db = require('../../lib/db')
const Promise = require('bluebird')
const path = require('path')
const fixtures = require('./fixtures')

const query = arity(Promise.promisify(function (sql, callback) {
  return db.query(sql, arity(callback, 2))
}), 1)

const schemaPath = path.join(__dirname, '..', '..', 'schema.sql')
const schema = splitByStatement(fs.readFileSync(schemaPath, 'utf8'))

module.exports = function () {
  return new Promise(function (resolve) {
    Promise.all(schema.map(query))
      .then(function(results) {
        return applyFixtures(fixtures)
      })
      .then(function(results) {
        return resolve(db)
      })
      .catch(function (err) {
        throw err
      })
  })
}

function splitByStatement(string) {
  return string.trim().split(';').map(call('trim')).filter(Boolean)
}
function call(method) {
  return function (obj) { return obj[method]() }
}
function arity(fn, num) {
  return function (_) {
    return fn.apply(null, firstN(arguments, num))
  }
}
function applyFixtures(fixtures) {
  // fixtures: [Table, [entry1, entry2, ..., entryN]]
  return Promise.all(fixtures.reduce(function (results, fixture) {
    const table = fixture[0]
    const data = fixture[1]
    data.forEach(function (item) {
      results.push(table.put(item))
    })
    return results
  }, []))
}

function firstN(args, n) {
  return [].slice.call(args, 0, n)
}
