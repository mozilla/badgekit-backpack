const Earners = require('../../models/earners')
const EarnerData = require('../../models/earner-data')

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


]
