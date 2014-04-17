const Earners = require('../../models/earners')
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

  [JSONModel, [
    { url: 'http://example.org/one',
      data: '{"sup": true}' },
  ]],

  [IssuerOrgs, [
    { id: 1,
      jsonUrl: 'http://example.org/one',
      name: 'Example Issuer',
      url: 'http://example.org' }
  ]],

  [BadgeClasses, [
    { id: 1,
      jsonUrl: 'http://example.org/one',
      issuerOrgId: 1,
      name: 'Example Badge Class',
      description: 'I AM ERROR',
      imageUrl: 'http://example.org/image.png',
      criteriaUrl: 'http://example.org/criteria',
      issuerJSONUrl: 'http://example.org/issuer.json' }
  ]],

]
