const db = require('../lib/db')
const Evidence = db.table('evidence', {
  fields: [
    'id',
    'earnerId',
    'createdOn',
    'slug',
    'content',
    'contentType',
  ],
  relationships: {
    earner: {
      type: 'hasOne',
      local: 'earnerId',
      foreign: { table: 'earners', key: 'id' },
    },
  },
})
module.exports = Evidence;
