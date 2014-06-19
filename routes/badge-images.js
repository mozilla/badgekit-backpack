const restify = require('restify')
const BadgeImages = require('../models/badge-images')

const NotFoundError = restify.NotFoundError

module.exports = function earnerRoutes(server) {
  server.get('/public/images/:imageSlug', getImage)
  function getImage(req, res, next) {
    const slug = req.params.imageSlug
    BadgeImages.getOne({slug: slug})
      .then(function (image) {
        if (!image)
          throw NotFoundError('image not found')

        // We may want to use a hash of the image data for ETag instead.
        res.header('ETag', slug)
        res.header('Content-Type', image.contentType)
        res.statusCode = 200
        res.write(image.getImageData())
        res.end()
      })
      .catch(NotFoundError, next)
      .catch(res.logInternalError('error getting image'))
  }
}
