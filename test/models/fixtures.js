const Faker = require('Faker')
const Earners = require('../../models/earners')
const Evidence = require('../../models/evidence')
const EarnerData = require('../../models/earner-data')
const JSONModel = require('../../models/json')
const IssuerOrgs = require('../../models/issuer-orgs')
const BadgeClasses = require('../../models/badge-classes')
const EarnerBadges = require('../../models/earner-badges')

module.exports = [
  [Earners, [
    {id: 'test-user'},
    {id: 'delete-me'},
  ]],

  [EarnerData, [
    { earnerId: 'test-user',
      key: 'sharks',
      value: 'keep moving' },
    { earnerId: 'test-user',
      key: 'bears',
      value: ', minus the' },
    { earnerId: 'test-user',
      key: 'complex',
      value: '{"array":[1,2,3]}' },

    { earnerId: 'delete-me',
      key: 'fool me once',
      value: 'now you don\'t' }
  ]],

  [Evidence, [
    { id: 100,
      earnerId: 'test-user',
      slug: 'delete-test',
      content: Buffer('this will be deleted').toString('base64'),
      contentType: 'text/plain',
      description: 'dleltleeedleld'},
    { id: 101,
      earnerId: 'test-user',
      slug: 'hi-test',
      content: Buffer('hi').toString('base64'),
      contentType: 'text/plain',
      description: 'A simple greeting'},
    { id: 102,
      earnerId: 'test-user',
      slug: 'sup-test',
      content: Buffer('sup').toString('base64'),
      contentType: 'text/plain',
      description: 'Another simple greeting'},
  ]],

  [JSONModel, makeRows(50, function (n) {
    return {
      url: 'http://example.org/' + n,
      data: '{"sup": true}',
    }
  })],

  [IssuerOrgs, [
    { id: 1,
      jsonUrl: 'http://example.org/1',
      name: 'Example Issuer',
      url: 'http://example.org' }
  ]],

  [BadgeClasses, [
    { id: 1,
      jsonUrl: 'http://example.org/1',
      issuerOrgId: 1,
      name: 'Example Badge Class',
      description: 'I AM ERROR',
      imageUrl: 'http://example.org/image.png',
      criteriaUrl: 'http://example.org/criteria',
      issuerJSONUrl: 'http://example.org/issuer.json' }
  ]],

  [EarnerBadges, makeRows(25, function (n) {
    return {
      jsonUrl: 'http://example.org/' + n,
      earnerId: 'test-user',
      badgeClassId: 1,
      uid: 'test-badge-' + n,
      badgeJSONUrl: 'http://example.org/badge.json',
    }
  })],
]

function sample(array) {
  const len = array.length
  const rnd = Math.random() * len | 0
  return array[rnd]
}

function makeRows(n, fn) {
  const rows = []
  var i = 0
  while (++i <= n) rows.push(fn(i))
  return rows
}
