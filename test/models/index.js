if (process.env.NODE_ENV !== 'test') {
  console.log('Must be in test environment to continue')
  process.exit(1)
}

const fs = require('fs')
const db = require('../../lib/db')
const Promise = require('bluebird')
const path = require('path')
const fixtures = require('./fixtures')
const migrations = require('../../lib/migrations')

const query = arity(Promise.promisify(function (sql, callback) {
  return db.query(sql, arity(callback, 2))
}), 1)

module.exports = function () {
  const future = applyMigrations()
    .then(dropDatabase)
    .then(function() { return applyFixtures(fixtures) })
    .then(function() { return db })
    .catch(function (err) {
      console.error(err);
      process.exit(1);
    });
  return future
}

function applyMigrations() {
  const config = db.getDbConfig()
  const migrateUp = Promise.promisify(migrations.up.bind(migrations))
  return migrateUp({ config: config })
}

function dropDatabase() {
  const migrationsTable = 'migrations'
  const future = query('SHOW TABLES')
    .then(function (tableData) {
      const truncateSql = ['SET `foreign_key_checks` = 0'];
      tableData.forEach(function (obj) {
        var table = obj[Object.keys(obj)[0]];
        if (table == migrationsTable) return;
        truncateSql.push('TRUNCATE TABLE `' + table + '`');
      })
      truncateSql.push('SET `foreign_key_checks` = 1');
      return Promise.all(truncateSql.map(query));
    })

    .catch(function (err) {
      console.error(err);
      process.exit(1);
    });

  return future;
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
