const package = require('../package')
const bunyan = require('bunyan');
module.exports = bunyan.createLogger({name: package.name});
