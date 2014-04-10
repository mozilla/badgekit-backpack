describe("FakeServer", function() {
  var subject;
  var path;
  var payload;
  var url;
  var request;
  beforeEach(function() {
    subject = FakeServer;
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
  });

  it("has route matchers", function() {
    expect(subject.routeMatchers).toBeObject();
  });

  describe("initialize", function() {
    beforeEach(function() {
      spyOn(_, "bindAll");
      subject.initialize();
    });

    it("binds externally called functions", function() {
      expect(_.bindAll).toHaveBeenCalledWith(subject, "handleCreateRequest", "handleRequest", "createRouteMatcher");
    });

    it("handles xhr requests", function() {
      expect(subject.xhr.onCreate).toEqual(subject.handleCreateRequest);
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
        subject.route(path, payload);
      });

      it("creates a route with the given path and payload", function() {
        expect(subject.routes).toHaveKey(path, payload);
      });

      it("creates the route matcher", function() {
        expect(subject.createRouteMatcher).toHaveBeenCalledWith(path);
      });
    });

    describe("createRouteMatcher", function() {
      var matcher;

      beforeEach(function() {
        matcher = subject.createRouteMatcher(path);
      });

      it("adds a new route matcher", function() {
        expect(subject.routeMatchers).toHaveKey(path);
      });

      it("returns the route matcher", function() {
        expect(matcher).toBeDefined();
        expect(matcher).toEqual(subject.routeMatchers[path]);
      });

      it("matches a matching path", function() {
        expect(matcher.test("/path/2")).toBeTrue();
      });

      it("does not match a non-matching path", function() {
        expect(matcher.test("/path/2/foo")).toBeFalse();
      });
    });
  });

  describe("handleCreateRequest", function() {
    beforeEach(function(done) {
      request = "fake request";
      spyOn(subject, "handleRequest").and.callFake(done);
      subject.handleCreateRequest(request);
    });

    it("adds the xhr to the requests", function() {
      expect(subject.requests.first()).toEqual(request);
    });

    it("handles the request", function() {
      expect(subject.handleRequest).toHaveBeenCalled();
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
        subject.route(path, payload);
      });

      it("returns the payload", function() {
        expect(subject.responsePayload(url)).toEqual(payload);
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
        subject.route(path, payload);
      });

      it("returns the return value of the function", function() {
        expect(subject.responsePayload(url)).toEqual(payload());
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
          subject.route(path, payload);
        });

        it("passes the dynamic segments to the route function, parsing numbers", function() {
          expect(subject.responsePayload(url)).toEqual({ value: "test", numeric: 12 });
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
      subject.route(url.path, payload);
    });

    it("determines if the route is defined", function() {
      expect(subject.hasRoute(url)).toBeTrue();
      expect(subject.hasRoute({ path: "/nonexistent" })).toBeFalse();
    });
  });

  describe("handleRequest", function() {
    beforeEach(function() {
      path = "/path";
      payload = "payload";
      subject.route(path, payload);
    });

    describe("when the url matches a route", function() {
      beforeEach(function() {
        subject.requests.length = 0;
        subject.requests.push({
          respond: jasmine.createSpy(),
          url: path
        });
        request = subject.requests.last();
        subject.handleRequest(0);
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
          url: "/not-found"
        });
        request = subject.requests.last();
        subject.handleRequest(0);
      });

      it("responds to the request with the payload", function() {
        expect(request.respond).toHaveBeenCalledWith(404, subject.NotFoundHeaders, "Page Not Found");
      });
    });
  });
});