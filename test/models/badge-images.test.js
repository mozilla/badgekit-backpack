const test = require('tap').test
const prepare = require('./')
const BadgeImages = require('../../models/badge-images')

const PNG_SIGNATURE = Buffer([0x89, 0x50, 0x4e, 0x47,
                              0x0d, 0x0a, 0x1a, 0x0a]);
const SIGNATURE_LENGTH = PNG_SIGNATURE.length;

prepare().then(function (db) {
  test('Sanity test', function (t) {
    BadgeImages.getOne({id: 1})
      .then(function (image) {
        t.same(image.slug, 'test');
        const imgData = image.getImageData();
        const imgSignature = imgData.slice(0, SIGNATURE_LENGTH);
        t.same(PNG_SIGNATURE, imgSignature);
        t.end()
      })
  })

  test('--close--', function (t) {
    db.close(), t.end()
  })
})
