(FakeServer = {
  xhr: sinon.useFakeXMLHttpRequest(),
  requests: [],
  JSONHeaders: { "Content-Type": "application/json" },
  NotFoundHeaders: { "Content-Type": "text/plain" },
  routes: {},
  routeMatchers: {},

  initialize: function() {
    _.bindAll(this,
      "handleCreateRequest",
      "handleRequest",
      "createRouteMatcher");
    this.xhr.onCreate = this.handleCreateRequest;
  },

  route: function(path, payload) {
    this.routes[path] = payload;
    this.createRouteMatcher(path);
  },

  createRouteMatcher: function(path) {
    var reString = "^\\/?" + path.split("/").compact().map(function(segment) {
      return segment.match(/^:/) ? segment.replace(/^.+$/, "([a-z0-9_-]+)") : segment;
    }).join("\\/") + "\\/?$";
    var pattern = new RegExp(reString);
    return this.routeMatchers[path] = pattern;
  },

  handleCreateRequest: function(request) {
    this.requests.push(request);
    var index = this.requests.indexOf(request);
    setTimeout(function() {
      FakeServer.handleRequest(index);
    }, 1);
  },

  handleRequest: function(index) {
    var request = this.requests[index];
    var url = this.parseUrl(request.url);
    if (this.hasRoute(url)) {
      request.respond(200, this.JSONHeaders, JSON.stringify(this.responsePayload(url)));
    } else {
      request.respond(404, this.NotFoundHeaders, "Page Not Found");
    }
  },

  hasRoute: function(url) {
    var hasRoute = false;
    this.routeMatchers.each(function(matcher, key) {
      if (matcher.test(url.path)) hasRoute = true;
    });
    return hasRoute;
  },

  responsePayload: function(url) {
    var route;
    var pattern;

    this.routeMatchers.each(function(matcher, key) {
      if (matcher.test(url.path)) {
        route = FakeServer.routes[key];
        pattern = matcher;
      }
    });

    if (isFunction(route)) {
      var args = url.path.match(pattern).rest();
      args = args.map(function(arg) {
        return /[0-9]+/.test(arg) ? parseInt(arg, 10) : arg;
      });
      return route.apply(null, args);
    } else {
      return route;
    }
  },

  parseUrl: function(url) {
    var a = document.createElement('a');
    a.href = url;

    return {
      origin: a.origin,
      port: a.port,
      protocol: a.protocol,
      query: a.search,
      params: this.parseQuery(a.search),
      path: a.pathname
    };
  },

  parseQuery: function(query) {
    var params = {};
    query.replace(/^\?/, '').split("&").each(function(keyValue) {
      var pair = keyValue.split("=");
      params[pair.first()] = pair.last();
    }, {});
    return params;
  }
}).initialize();
