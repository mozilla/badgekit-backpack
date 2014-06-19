const db = require('../lib/db')
const BadgeImages = db.table('badgeImages', {
  fields: [ 'id', 'slug', 'contentType', 'data' ],
  methods: {
    getImageData: function getImageData() {
      return Buffer(this.data, 'base64').toString('binary');
    },
  }
})
module.exports = BadgeImages;
