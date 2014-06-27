module.exports = APIClient;

const Promise = require('bluebird');
const fmt = require('util').format;
const http = require('http');
const https = require('https');
const url = require('url');
const concat = require('concat-stream');
const createAuthHeader = require('./api-authorization');

function APIClient(opts) {
  opts = opts || {};
  this.secret = opts.secret || process.env.API_SECRET;
  this.key = opts.key || process.env.API_KEY || 'master';
  this.host = opts.host || process.env.API_HOST;
  this.defaultLimit = opts.defaultLimit;

  if (!this.secret)
    throw new RangeError('Must pass a `secret` or set API_SECRET environment variable');

  if (!this.host)
    throw new RangeError('Must pass a `host` or set API_HOST environment variable');

  var hostUrlObj;
  try {
    hostUrlObj = url.parse(this.host)
  } catch(error) {
    throw new TypeError('Could not parse `host` as a valid URL, make sure it is a string');
  }

  if (!hostUrlObj.protocol)
    throw new RangeError('`host` must be a valid fully qualified URL');
}

APIClient.prototype = {
  request: function request(opts) {
    const host = opts.host || this.host;
    const method = opts.method;
    const body = opts.body;
    const path = opts.path;

    const protocol = isHttps(host) ? https : http;
    const reqFn = protocol.request.bind(protocol);
    const fullUrl = host + opts.path;
    const reqOpts = url.parse(fullUrl);

    reqOpts.method = method;
    reqOpts.headers = {
      'content-type': 'application/json',
      'authorization': createAuthHeader({
        method: method,
        path: path,
        body: body || null,
        apiSecret: this.secret,
        apiKey: this.key,
      })
    }

    if (opts.body)
      reqOpts.headers['content-length'] = Buffer(body).length;

    return new Promise(function (resolve, reject) {
      var req;
      try {
        req = reqFn(reqOpts, responseHandler);
      } catch(err) {
        return reject(err);
      }

      if (req.body) {
        req.write(body);
      }

      req.end();

      req.on('error', reject);


      function responseHandler(res) {
        res.setEncoding('utf8');
        res.on('error', reject);
        res.pipe(concat(function (data) {
              var responseBody;

          try {
            responseBody = JSON.parse(data);
          } catch(err){
            return reject(new TypeError('Could not parse response as JSON'));
          }

          if (res.statusCode >= 400) {
            return reject(new APIClient.BadResponse({
              statusCode: res.statusCode,
              response: responseBody,
            }));
          }

          return resolve(responseBody);
        }))
      }

    })

  },

  getAllBadges: function getAllBadges(opts) {
    const host = opts.host || this.host;
    const user = opts.user;
    const limit = opts.limit || this.defaultLimit || 0;
    const page = opts.page || 1;

    const method = 'GET';
    const path = fmt('/user/%s/badges?limit=%s&page=%s',
                     user, limit, page);

    return this.request({path: path, method: method});
  },

  getOneBadge: function getOneBadge(opts) {
    const host = opts.host || process.env.API_HOST;
    const user = opts.user;
    const badgeId = opts.badgeId;

    const method = 'GET';
    const path = fmt('/user/%s/badges/%s', user, badgeId);

    return this.request({path: path, method: method});
  },

  deleteBadge:function deleteBadge(opts) {
    const host = opts.host || this.host;
    const user = opts.user;
    const badgeId = opts.badgeId;

    const method = 'DELETE';
    const path = fmt('/user/%s/badges/%s', user, badgeId);

    return this.request({path: path, method: method});
  },
}

APIClient.BadResponse = function BadResponse (obj) {
  this.message = "Received a bad server response";
  this.statusCode = obj.statusCode;
  this.response = obj.response;
}

APIClient.BadResponse.prototype = Object.create(Error.prototype);



function isHttps(url) {
  return url.indexOf('https://') === 0;
}
