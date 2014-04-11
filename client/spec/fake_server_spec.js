describe("FakeServer", function() {
  var subject;
  var path;
  var payload;
  var url;
  var request;
  var verb;
  beforeEach(function() {
    subject = FakeServer;
    verb = "get";
  });

  it("creates a fake xhr request instance", function() {
    expect(subject.xhr).toBeDefined();
  });

  it("has requests", function() {
    expect(subject.requests).toBeArray();
  });

  it("has JSON headers", function() {
    expect(subject.JSONHeaders).toEqual({ "Content-Type": "application/json" });
  });

  it("has Not Found headers", function() {
    expect(subject.NotFoundHeaders).toEqual({ "Content-Type": "text/plain" });
  });

  it("has routes", function() {
    expect(subject.routes).toBeObject();
    expect(subject.routes.get).toBeObject();
    expect(subject.routes.post).toBeObject();
    expect(subject.routes.delete).toBeObject();
    expect(subject.routes.put).toBeObject();
    expect(subject.routes.patch).toBeObject();
  });

  it("has route matchers", function() {
    expect(subject.routeMatchers).toBeObject();
    expect(subject.routeMatchers.get).toBeObject();
    expect(subject.routeMatchers.post).toBeObject();
    expect(subject.routeMatchers.delete).toBeObject();
    expect(subject.routeMatchers.put).toBeObject();
    expect(subject.routeMatchers.patch).toBeObject();
  });

  describe("initialize", function() {
    beforeEach(function() {
      spyOn(_, "bindAll");
      subject.initialize();
    });

    it("binds externally called functions", function() {
      expect(_.bindAll).toHaveBeenCalledWith(subject, "handleRequest");
    });

    it("handles xhr requests", function() {
      expect(subject.xhr.onCreate).toEqual(subject.handleRequest);
    });
  });

  describe("routing", function() {
    beforeEach(function() {
      path = "/path/:var";
      payload = { key: "value" };
    });

    describe("route", function() {
      beforeEach(function() {
        spyOn(subject, "createRouteMatcher");
        subject.route(verb, path, payload);
      });

      it("creates a route with the given verb, path and payload", function() {
        expect(subject.routes.get).toHaveKey(path, payload);
      });

      it("creates the route matcher", function() {
        expect(subject.createRouteMatcher).toHaveBeenCalledWith(verb, path);
      });
    });

    describe("createRouteMatcher", function() {
      var matcher;

      beforeEach(function() {
        matcher = subject.createRouteMatcher(verb, path);
      });

      it("adds a new route matcher", function() {
        expect(subject.routeMatchers.get).toHaveKey(path);
      });

      it("returns the route matcher", function() {
        expect(matcher).toBeDefined();
        expect(matcher).toEqual(subject.routeMatchers.get[path]);
      });

      it("matches a matching path", function() {
        expect(matcher.test("/path/2")).toBeTrue();
      });

      it("does not match a non-matching path", function() {
        expect(matcher.test("/path/2/foo")).toBeFalse();
      });
    });
  });

  describe("handleRequest", function() {
    beforeEach(function(done) {
      request = "fake request";
      spyOn(subject, "respond").and.callFake(done);
      subject.handleRequest(request);
    });

    it("adds the xhr to the requests", function() {
      expect(subject.requests.first()).toEqual(request);
    });

    it("handles the request", function() {
      expect(subject.respond).toHaveBeenCalled();
    });
  });

  describe("parseQuery", function() {
    var query;
    var parsedQuery;
    beforeEach(function() {
      query = "?key=value&anotherKey=anotherValue";
      parsedQuery = subject.parseQuery(query);
    });

    it("returns an object of key pairs", function() {
      expect(parsedQuery).toEqual({
        key: "value",
        anotherKey: "anotherValue"
      });
    });
  });

  describe("parseUrl", function() {
    var parsedUrl;
    beforeEach(function() {
      parsedUrl = subject.parseUrl("/path?query=string");
    });

    it("parses a url", function() {
      expect(parsedUrl).toHaveKey("origin", "http://localhost:3001");
      expect(parsedUrl).toHaveKey("path", "/path");
      expect(parsedUrl).toHaveKey("port", "3001");
      expect(parsedUrl).toHaveKey("protocol", "http:");
      expect(parsedUrl).toHaveKey("query", "?query=string");
      expect(parsedUrl.params).toHaveKey("query", "string");
    });
  });

  describe("responsePayload", function() {
    describe("value route", function() {
      beforeEach(function() {
        path = "/value";
        payload = "payload";
        url = {
          path: path
        };
        subject.route(verb, path, payload);
      });

      it("returns the payload", function() {
        expect(subject.responsePayload(verb, url)).toEqual(payload);
      });
    });

    describe("function route", function() {
      beforeEach(function() {
        path = "/function";
        payload = function() {
          return "payload";
        };
        url = {
          path: path
        };
        subject.route(verb, path, payload);
      });

      it("returns the return value of the function", function() {
        expect(subject.responsePayload(verb, url)).toEqual(payload());
      });

      describe("dynamic segments", function() {
        beforeEach(function() {
          path = "/dynamic/:value/:numeric";
          payload = function(value, numeric) {
            return { value: value, numeric: numeric };
          };
          url = {
            path: "/dynamic/test/12"
          };
          subject.route(verb, path, payload);
        });

        it("passes the dynamic segments to the route function, parsing numbers", function() {
          expect(subject.responsePayload(verb, url)).toEqual({ value: "test", numeric: 12 });
        });
      });
    });
  });

  describe("hasRoute", function() {
    beforeEach(function() {
      path = "/path";
      payload = "payload";
      url = {
        path: path
      };
      subject.route(verb, url.path, payload);
    });

    it("determines if the route is defined", function() {
      expect(subject.hasRoute(verb, url)).toBeTrue();
      expect(subject.hasRoute(verb, { path: "/nonexistent" })).toBeFalse();
    });
  });

  describe("respond", function() {
    beforeEach(function() {
      path = "/path";
      payload = "payload";
      subject.route(verb, path, payload);
    });

    describe("when the url matches a route", function() {
      beforeEach(function() {
        subject.requests.length = 0;
        subject.requests.push({
          respond: jasmine.createSpy(),
          url: path,
          method: "GET"
        });
        request = subject.requests.last();
        subject.respond(0);
      });

      it("responds to the request with the payload", function() {
        expect(request.respond).toHaveBeenCalledWith(200, subject.JSONHeaders, JSON.stringify(payload));
      });
    });

    describe("when the url does not match a route", function() {
      beforeEach(function() {
        subject.requests.length = 0;
        subject.requests.push({
          respond: jasmine.createSpy(),
          url: "/not-found",
          method: "GET"
        });
        request = subject.requests.last();
        subject.respond(0);
      });

      it("responds to the request with the payload", function() {
        expect(request.respond).toHaveBeenCalledWith(404, subject.NotFoundHeaders, "Page Not Found");
      });
    });
  });
});
