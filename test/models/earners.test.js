const test = require('tap').test
const prepare = require('./')
const EarnerData = require('../../models/earner-data')
const Earners = require('../../models/earners')

prepare().then(function (db) {
  test('Sanity test', function (t) {
    const data = {id: 'some-user-identification'}

    Earners.put(data)
      .then(function (earner) {
        return Earners.getOne(data)
      })

      .then(function(earner) {
        t.same(earner.id, data.id, 'has right id')
        t.ok(earner.createdOn, 'has createdOn date')
        return Earners.del(data)
      })

      .then(function(result) {
        t.same(result.affectedRows, 1, 'deletes 1 row')
        return Earners.getOne(data)
      })

      .then(function(earner) {
        t.notOk(earner, 'does not find an earner')
        t.end()
      })
  })

  test('Retrieving associated earner data', function (t) {
    const expect = {
      sharks: 'keep moving',
      bears: ', minus the',
      complex: '{"array":[1,2,3]}'
    }
    const query = {id: 'test-user'}
    const options = {relationships: true}

    Earners.getOne(query, options)
      .then(function(earner) {
        t.same(earner.metadata(), expect, 'gets correct user metadata')
        t.end()
      })
  })

  test('Earner data should get deleted when earner is deleted', function (t) {
    const earnerId = 'delete-me'
    EarnerData.get({earnerId: earnerId})
      .then(function(data) {
        t.same(data.length, 1, 'gets one result')
        t.same(data[0].key, 'fool me once', 'gets the right key')
        return Earners.del({id: earnerId})
      })

      .then(function(result) {
        return EarnerData.get({earnerId: earnerId})
      })

      .then(function(data) {
        t.same(data.length, 0, 'associated data gets deleted')
        t.end()
      })
  })

  test('--close--', function (t) {
    db.close(), t.end()
  })
})
