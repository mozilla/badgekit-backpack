FakeServer = {
  xhr: sinon.useFakeXMLHttpRequest(),
  requests: [],
  responseTime: 500,
  JSONHeaders: { "Content-Type": "application/json" },
  NotFoundHeaders: { "Content-Type": "text/plain" },
  routes: {
    get: {},
    post: {},
    delete: {},
    put: {},
    patch: {}
  },
  routeMatchers: {
    get: {},
    post: {},
    delete: {},
    put: {},
    patch: {}
  },

  initialize: function() {
    _.bindAll(this, "handleRequest");
    this.xhr.onCreate = this.handleRequest;
  },

  route: function(verb, path, payload) {
    verb = verb.toLowerCase();
    this.routes[verb][path] = payload;
    this.createRouteMatcher(verb, path);
  },

  createRouteMatcher: function(verb, path) {
    var reString = "^\\/?" + path.split("/").compact().map(function(segment) {
      return segment.match(/^:/) ? segment.replace(/^.+$/, "([a-z0-9_-]+)") : segment;
    }).join("\\/") + "\\/?$";
    var pattern = new RegExp(reString);
    return this.routeMatchers[verb][path] = pattern;
  },

  handleRequest: function(request) {
    this.requests.push(request);
    var index = this.requests.indexOf(request);
    setTimeout(function() {
      FakeServer.respond(index);
    }, this.responseTime);
  },

  respond: function(index) {
    var request = this.requests[index];
    if (!request) return;
    var verb = request.method.toLowerCase();
    var url = this.parseUrl(request.url);
    if (this.interceptedResponse) {
      var ir = this.interceptedResponse;
      if (isFunction(ir.payload)) {
        request.respond(ir.status, ir.headers, JSON.stringify(ir.payload()));
      } else {
        request.respond(ir.status, ir.headers, JSON.stringify(ir.payload));
      }
      this.interceptedResponse = undefined;
      return;
    };

    if (this.hasRoute(verb, url)) {
      request.respond(200, this.JSONHeaders, JSON.stringify(this.responsePayload(verb, url)));
    } else {
      request.respond(404, this.NotFoundHeaders, "Page Not Found");
    }
  },

  hasRoute: function(verb, url) {
    var hasRoute = false;
    this.routeMatchers[verb].each(function(matcher, key) {
      if (matcher.test(url.path)) {
        hasRoute = true;
        return false;
      }
    });
    return !!hasRoute;
  },

  responsePayload: function(verb, url) {
    var routePayload;
    var pattern;

    this.routeMatchers[verb].each(function(matcher, key) {
      if (matcher.test(url.path)) {
        routePayload = FakeServer.routes[verb][key];
        pattern = matcher;
      }
    });

    if (this.interceptPayload) {
      routePayload = this.interceptPayload;
      this.interceptPayload = undefined;
    }

    if (isFunction(routePayload)) {
      var args = url.path.match(pattern).rest();
      args = args.map(function(arg) {
        return /[0-9]+/.test(arg) ? arg.toNumber() : arg;
      });
      args.push(url.params);
      return routePayload.apply(null, args);
    } else {
      return routePayload;
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
  },

  interceptResponse: function(interceptPayload) {
    this.interceptedResponse = ({
      payload: "",
      status: 200,
      headers: this.JSONHeaders
    }).mixin(interceptPayload);
  },
};

FakeServer.initialize();
