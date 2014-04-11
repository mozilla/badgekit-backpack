const util = require('util')
const InternalServerError = require('restify').InternalServerError

module.exports = function logInternalError(opts) {
  return function (req, res, next) {

    res.logInternalError = function (msg) {
      const msgArgs = arguments
      return function (error) {
        req.log.error(error, util.format.apply(util, msgArgs))
        return res.send(new InternalServerError('Something went wrong on our side, please try again later'))
      }
    }

    return next()
  }
}
