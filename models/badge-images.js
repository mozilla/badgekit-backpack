const db = require('../lib/db')
const BadgeImages = db.table('badgeImages', {
  fields: [ 'id', 'slug', 'contentType', 'data' ],
  methods: {
    getImageData: function getImageData() {
      // So the data *should* go in as base64. We get back a buffer of
      // base64 character data, so we turn it into a string, then *back*
      // into a buffer, passing base64 into the constructor so it knows
      // to convert it back into binary.
      return Buffer(this.data.toString(), 'base64');
    },
  }
})
module.exports = BadgeImages;
