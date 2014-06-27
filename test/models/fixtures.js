const path = require('path')
const fs = require('fs')
const Earners = require('../../models/earners')
const Evidence = require('../../models/evidence')
const EarnerData = require('../../models/earner-data')
const JSONModel = require('../../models/json')
const IssuerOrgs = require('../../models/issuer-orgs')
const IssuerTokens = require('../../models/issuer-tokens')
const BadgeClasses = require('../../models/badge-classes')
const EarnerBadges = require('../../models/earner-badges')
const BadgeImages = require('../../models/badge-images')

const TEST_USER = process.env['TEST_USER'] || 'test-user';

module.exports = [
  [IssuerTokens, [
    {name: 'Widgets', key: 'widgets', token: 'shhsecret'},
  ]],

  [Earners, [
    {id: TEST_USER},
    {id: 'delete-me'},
  ]],

  [EarnerData, [
    { earnerId: TEST_USER,
      key: 'sharks',
      value: 'keep moving' },
    { earnerId: TEST_USER,
      key: 'bears',
      value: ', minus the' },
    { earnerId: TEST_USER,
      key: 'complex',
      value: '{"array":[1,2,3]}' },

    { earnerId: 'delete-me',
      key: 'fool me once',
      value: 'now you don\'t' }
  ]],

  [Evidence, [
    { id: 100,
      earnerId: TEST_USER,
      slug: 'delete-test',
      content: Buffer('this will be deleted').toString('base64'),
      contentType: 'text/plain',
      description: 'dleltleeedleld'},
    { id: 101,
      earnerId: TEST_USER,
      slug: 'hi-test',
      content: Buffer('hi').toString('base64'),
      contentType: 'text/plain',
      description: 'A simple greeting'},
    { id: 102,
      earnerId: TEST_USER,
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

  [BadgeImages, [
    { id: 1,
      slug: 'test',
      contentType: 'image/png',
      data: fs.readFileSync(path.join(__dirname, 'test-image.png')).toString('base64'),
    }
  ]],

  [EarnerBadges, makeRows(25, function (n) {
    return {
      jsonUrl: 'http://example.org/' + n,
      earnerId: TEST_USER,
      badgeClassId: 1,
      badgeImageSlug: 'test',
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
