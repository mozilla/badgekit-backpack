describe("App", function() {
  var subject;
  beforeEach(function() {
    subject = App;
  });

  it("has a Models namespace", function() {
    expect(subject.Models).toBeObject();
  });

  it("has a Collections namespace", function() {
    expect(subject.Collections).toBeObject();
  });

  it("has a Views namespace", function() {
    expect(subject.Views).toBeObject();
  });

  it("has a Controllers namespace", function() {
    expect(subject.Views).toBeObject();
  });

  it("has a Dispatcher", function() {
    expect(subject.Dispatcher).toBeDefined();
    expect(subject.Dispatcher.on).toBeDefined();
    expect(subject.Dispatcher.off).toBeDefined();
    expect(subject.Dispatcher.trigger).toBeDefined();
  });
});

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
      expect(parsedUrl).toHaveKey("origin", "http://localhost:" + location.port);
      expect(parsedUrl).toHaveKey("path", "/path");
      expect(parsedUrl).toHaveKey("port",  location.port);
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

      describe("with query params", function() {
        var params;
        beforeEach(function() {
          params = {
            key: "value",
            anotherKey: "anotherValue"
          };
          path = "/function/:id";
          payload = jasmine.createSpy().and.returnValue("payload");
          url = {
            path: "/function/1",
            params: params
          };
          subject.route(verb, path, payload);
          subject.responsePayload(verb, url);
        });

        it("passes the query params as the last argument", function() {
          expect(payload).toHaveBeenCalledWith(1, params);
        });
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

FakeServer.responseTime = 1;

describe("App.Controllers.Dashboard", function() {
  var subject;
  var userAttributes;
  var $myBadges;
  var $badgesPagination;
  var $badgeFilter;
  beforeEach(function() {
    userAttributes = _.clone(FakeAPI.users.first());
    $myBadges = affix("#my-badges");
    $badgeFilter = affix("#badge-filter");
    $badgesPagination = affix("#badges-pagination");
    subject = App.Controllers.Dashboard;
  });

  describe("initialize", function() {
    beforeEach(function() {
      spyOn(_, "bindAll");
      subject.initialize();
    });

    it("binds all methods to the controller", function() {
      _.functions(subject).each(function(method) {
        expect(_.bindAll).toHaveBeenCalledWith(subject, method);
      });
    });
  });

  describe("index", function() {
    describe("initIndex", function() {
      beforeEach(function() {
        spyOn(subject, "cacheIndexElements").and.callThrough();
        spyOn(subject, "fetchBadges");
        subject.initIndex({ id: 1 });
      });

      it("caches the index elements", function() {
        expect(subject.cacheIndexElements).toHaveBeenCalled();
      });

      it("sets the user", function() {
        expect(subject.user).toBeTypeof(App.Models.User);
        expect(subject.user.id).toEqual(1);
      });

      it("fetches the user", function() {
        expect(subject.fetchBadges).toHaveBeenCalled();
      });

      it("toggles loading on the badges element", function() {
        expect(subject.myBadges).toHaveClass("loading");
      });
    });

    describe("fetchBadges", function() {
      beforeEach(function() {
        subject.user = new App.Models.User({ id: 1 });
        spyOn(subject.user.get("badges"), "fetch").and.returnValue(promiseStub);
        subject.fetchBadges();
      });

      it("fetches the user", function() {
        expect(subject.user.get("badges").fetch).toHaveBeenCalled();
      });

      it("calls handleBadgesFetchSuccess when done", function() {
        expect(promiseStub.done).toHaveBeenCalledWith(subject.handleBadgesFetchSuccess);
      });

      it("calls handleBadgeFetchFailure when it fails", function() {
        expect(promiseStub.fail).toHaveBeenCalledWith(subject.handleBadgeFetchFailure);
      });
    });

    describe("cacheIndexElements", function() {
      beforeEach(function() {
        subject.cacheIndexElements();
      });

      it("has a myBadges reference", function() {
        expect(subject.myBadges).toBeJqueryWrapped("#my-badges");
      });
    });

    describe("handleBadgesFetchSuccess", function() {
      beforeEach(function() {
        spyOn(subject, "renderBadges");
        subject.badgesView = new App.Views.Badges;
        subject.handleBadgesFetchSuccess();
      });

      it("renders the badges", function() {
        expect(subject.renderBadges).toHaveBeenCalled();
      });

      it("creates a paginator view", function() {
        expect(subject.badgePaginator).toBeTypeof(App.Views.Paginator);
        expect(subject.badgePaginator.$el).toBeJqueryWrapped("#badges-pagination");
        expect(subject.badgePaginator.collection).toEqual(subject.user.get("badges"));
      });

      it("creates a BadgeFilter view", function() {
        expect(subject.badgeFilter).toBeTypeof(App.Views.BadgeFilter);
        expect(subject.badgeFilter.$el).toBeJqueryWrapped("#badge-filter");
        expect(subject.badgeFilter.collection).toEqual(subject.user.get("badges"));
      });

      it("toggles the loading on myBadges", function() {
        expect(subject.myBadges).not.toHaveClass("loading");
      });
    });

    describe("renderBadges", function() {
      beforeEach(function() {
        subject.user = new App.Models.User(userAttributes);
        subject.renderBadges();
      });

      it("creates a badges view", function() {
        expect(subject.badgesView).toBeTypeof(App.Views.Badges);
      });

      it("renders the badges view", function() {
        var size = userAttributes.badges.length;
        var expectedChildCount = Math.floor(size + (size / 4));
        expect(subject.myBadges.children().length).toEqual(expectedChildCount);
      });
    });

    describe("handleBadgeFetchFailure", function() {
      beforeEach(function() {
        subject.handleBadgeFetchFailure();
      });

      it("renders an error message", function() {
        expect(subject.myBadges).toHaveText("There was an error fetching your badges");
      });
    });
  });
});

describe("App.Models.Badge", function() {
  var subject;
  var badgeAttributes;
  beforeEach(function() {
    badgeAttributes = _.clone(FakeAPI.users.first().badges.first());
    subject = new App.Models.Badge(badgeAttributes);
  });

  it("has STATUSES", function() {
    expect(App.Models.Badge.STATUSES).toEqual(["awarded", "in queue", "reviewed"]);
  });

  it("has TYPES", function() {
    expect(App.Models.Badge.TYPES).toEqual(['Community', 'Skill', 'Knowledge', 'Showcase']);
  });

  it("has a urlRoot", function() {
    expect(subject.urlRoot()).toEqual("/user/" + subject.get("earnerId") + "/badges/" + subject.id);
  });
});

describe("App.Collections.Badges", function() {
  var subject;
  beforeEach(function() {
    subject = new App.Collections.Badges;
  });

  it("has a page", function() {
    expect(subject.page).toEqual(1);
  });

  it("has a perPage value", function() {
    expect(subject.perPage).toBeNumber();
  });

  describe("when there is no user id", function() {
    beforeEach(function() {
      subject = new App.Collections.Badges();
    });

    it("has an empty url", function() {
      expect(subject.url()).toBeUndefined();
    });
  });

  describe("when there is a userId", function() {
    var badgeAttributes;
    var userId;
    beforeEach(function() {
      badgeAttributes = FakeAPI.users.first().badges.first();
      subject = new App.Collections.Badges([badgeAttributes]);
      userId = 1;
      subject.userId = userId;
    });

    it("has a url", function() {
      var expectedURL = "/user/" + subject.userId + "/badges?page=" + subject.page + "&perPage=" + subject.perPage;
      expect(subject.url()).toEqual(expectedURL);
    });
  });
});

describe("App.Models.BaseModel", function() {
  var BaseModel;
  var ChildModel;
  var data;
  var subject;

  beforeEach(function() {
    ChildModel = App.Models.BaseModel.extend();
    BaseModel = App.Models.BaseModel.extend({
      relationships: {
        first_child: ChildModel,
        second_child: ChildModel
      }
    });
    data = { first_child: { id: 1 }};
    subject = new BaseModel;
  });

  describe("wrapAttribute", function() {
    it("wraps the given attribute", function() {
      subject.wrapAttribute(data, "first_child", ChildModel);
      expect(data.first_child).toBeTypeof(ChildModel);
    });
  });

  describe("parse", function() {
    it("wraps the given attributes", function() {
      spyOn(subject, "wrapAttribute").and.callThrough();
      subject.parse(data);
      expect(subject.wrapAttribute).toHaveBeenCalled();
      expect(data.first_child).toBeTypeof(ChildModel);
    });
  });

  describe("isPersisted", function() {
    it("returns the opposite of isNew", function() {
      expect(subject.isPersisted()).toBeFalse();
      spyOn(subject, "isNew").and.returnValue(false);
      expect(subject.isPersisted()).toBeTrue();
    });
  });
});

describe("App.Models.User", function() {
  var subject;
  beforeEach(function() {
    subject = new App.Models.User({ id: 1 });
  });

  it("has a urlRoot", function() {
    expect(subject.urlRoot).toEqual("/user");
    expect(subject.url()).toEqual("/user/" + subject.id);
  });

  it("creates an empty badges collection", function() {
    expect(subject.get("badges")).toBeTypeof(App.Collections.Badges);
  });

  it("sets the userId on the badge collection", function() {
    expect(subject.get("badges").userId).toEqual(subject.id);
  });

  describe("relationships", function() {
    var userAttributes;
    beforeEach(function() {
      userAttributes = _.clone(FakeAPI.users.first());
      subject = new App.Models.User(userAttributes);
    });

    it("wraps badges in a Badges collection", function() {
      expect(subject.get("badges")).toBeTypeof(App.Collections.Badges);
    });
  });
});

describe("App.Views.BadgeFilter", function() {
  var subject;
  var collection;
  beforeEach(function() {
    affix("#container");
    collection = new App.Collections.Badges;
    subject = new App.Views.BadgeFilter({
      el: "#container",
      collection: collection
    });
  });

  it("has a template", function() {
    expect(subject.template).toBeDefined();
    expect(subject.template).toEqual(App.Templates.badge_filter);
  });

  describe("initialize", function() {
    beforeEach(function() {
      spyOn(subject, "render");
      spyOn(subject, "cacheElements");
      spyOn(subject, "initializeDatepicker");
      subject.initialize();
    });

    it("renders the view", function() {
      expect(subject.render).toHaveBeenCalled();
    });

    it("caches the elements", function() {
      expect(subject.cacheElements).toHaveBeenCalled();
    });

    it("initializes the datepicker", function() {
      expect(subject.initializeDatepicker).toHaveBeenCalled();
    });

    it("sets onBeforeFetch to a noop by default", function() {
      expect(subject.onBeforeFetch).toEqual($.noop);
    });

    it("sets onAfterFetch to a noop by default", function() {
      expect(subject.onAfterFetch).toEqual($.noop);
    });

    describe("options", function() {
      var onBeforeFetchSpy;
      var onAfterFetchSpy;
      beforeEach(function() {
        onBeforeFetchSpy = jasmine.createSpy();
        onAfterFetchSpy = jasmine.createSpy();
        subject = new App.Views.BadgeFilter({
          el: "#container",
          collection: collection,
          onBeforeFetch: onBeforeFetchSpy,
          onAfterFetch: onAfterFetchSpy
        });
      });

      it("sets the onBeforeFetch callback", function() {
        expect(subject.onBeforeFetch).toEqual(onBeforeFetchSpy);
      });

      it("sets the onAfterFetch callback", function() {
        expect(subject.onAfterFetch).toEqual(onAfterFetchSpy);
      });
    });
  });

  describe("render", function() {
    beforeEach(function() {
      subject.render();
    });

    it("renders the template", function() {
      expect(subject.$el.children().length).toBeGreaterThan(0);
    });

    it("passes the badge statuses to the template", function() {
      App.Models.Badge.STATUSES.each(function(status) {
        expect(subject.$el.find('[name="filter-badge-status"] option').text()).toMatch(status);
      });
    });

    it("passes the badge types to the template", function() {
      App.Models.Badge.TYPES.each(function(type) {
        expect(subject.$el.find('[name="filter-badge-type"] option').text()).toMatch(type);
      });
    });
  });

  describe("cacheElements", function() {
    beforeEach(function() {
      subject.render();
      subject.cacheElements();
    });

    it("caches a reference to the status select", function() {
      expect(subject.statusSelect).toBeJqueryWrapped("#filter-badge-status-select");
    });

    it("caches a reference to the type select", function() {
      expect(subject.typeSelect).toBeJqueryWrapped("#filter-badge-type-select");
    });

    it("caches a reference to the category select", function() {
      expect(subject.categorySelect).toBeJqueryWrapped("#filter-badge-category-select");
    });

    it("caches a reference to the date field", function() {
      expect(subject.dateField).toBeJqueryWrapped("#filter-badge-date-field");
    });
  });

  describe("initializeDatepicker", function() {
    beforeEach(function() {
      spyOn(subject.dateField, "datepicker");
      subject.initializeDatepicker();
    });

    it("initializes the datepicker on the dateField", function() {
      expect(subject.dateField.datepicker).toHaveBeenCalled();
    });
  });

  describe("getFilters", function() {
    var filters;
    beforeEach(function() {
      subject.render();
      subject.statusSelect.val(App.Models.Badge.STATUSES.last());
      subject.typeSelect.val(App.Models.Badge.TYPES.last());
      filters = subject.getFilters();
    });

    it("returns the filter data as json", function() {
      expect(filters).toEqual({
        status: App.Models.Badge.STATUSES.last(),
        type: App.Models.Badge.TYPES.last()
      });
    });
  });

  describe("handleSearchButtonClick", function() {
    beforeEach(function() {
      subject.render();
      subject.statusSelect.val(App.Models.Badge.STATUSES.last());
      subject.typeSelect.val(App.Models.Badge.TYPES.last());
      spyOn(subject.collection, "fetch").and.returnValue(promiseStub);
      spyOn(subject, "onBeforeFetch");
      spyOn(subject, "onAfterFetch");
      spyOn(subject, "toggleLoading");
      subject.handleSearchButtonClick(eventStub);
    });

    it("prevents default behavior", function() {
      expect(eventStub.preventDefault).toHaveBeenCalled();
    });

    it("sets the filters on the model", function() {
      expect(collection.filters).toEqual(subject.getFilters());
    });

    it("calls the onBeforeFetch callback", function() {
      expect(subject.onBeforeFetch).toHaveBeenCalled();
    });

    it("toggles loading", function() {
      expect(subject.toggleLoading).toHaveBeenCalled();
    });

    it("fetches the collection", function() {
      expect(subject.collection.fetch).toHaveBeenCalled();
    });

    it("handles search success when the colleciton is fetched", function() {
      expect(promiseStub.done).toHaveBeenCalledWith(subject.handleSearchSuccess);
    });
  });

  describe("handleSearchSuccess", function() {
    beforeEach(function() {
      spyOn(subject, "onAfterFetch");
      spyOn(subject, "toggleLoading");
      subject.handleSearchSuccess();
    });

    it("calls the onAfterFetch callback", function() {
      expect(subject.onAfterFetch).toHaveBeenCalled();
    });

    it("toggles loading", function() {
      expect(subject.toggleLoading).toHaveBeenCalled();
    });
  });

  describe("events", function() {
    it("registers handleSearchButtonClick to the search button click event", function() {
      expect(subject.events["click button.search"]).toEqual("handleSearchButtonClick");
    });
  });
});

describe("App.Views.Badge", function() {
  var subject;
  var badgeAttributes;
  var badgeJSON;
  beforeEach(function() {
    badgeAttributes = _.clone(FakeAPI.users.first().badges.first());
    affix("#container");
    subject = new App.Views.Badge({
      el: "#container",
      model: new App.Models.Badge(badgeAttributes)
    });
  });

  it("has a template", function() {
    expect(subject.template).toBeDefined();
    expect(subject.template).toEqual(App.Templates.badge);
  });

  it("has a className", function() {
    expect(subject.className).toEqual("badge");
  });

  it("is an li element", function() {
    expect(subject.tagName).toEqual("li");
  });

  it("has a description length", function() {
    expect(subject.descriptionLength).toBeNumber();
  });

  describe("render", function() {
    beforeEach(function() {
      badgeJSON = subject.badgeJSON();
      subject.render();
    });

    it("renders the model data in the template", function() {
      expect(subject.$el.find(".inner")).toHaveClass(badgeJSON.statusClass);
      expect(subject.$el.find(".description")).toHaveText(badgeJSON.description);
      expect(subject.$el.find("img")).toHaveAttribute("src", badgeJSON.imageUrl);
      expect(subject.$el.find(".ribbon")).toHaveText(badgeJSON.ribbonText);
    });
  });

  describe("badgeJSON", function() {
    beforeEach(function() {
      badgeJSON = subject.badgeJSON();
    });

    it("returns an object of the model attributes", function() {
      expect(badgeJSON).toHaveKey("name", subject.model.get("name"));
      expect(badgeJSON).toHaveKey("status", subject.model.get("status"));
      expect(badgeJSON).toHaveKey("imageUrl", subject.model.get("imageUrl"));
      expect(badgeJSON).toHaveKey("description", subject.model.get("description").truncate(subject.descriptionLength));
      expect(badgeJSON).toHaveKey("statusClass", subject.statusClass());
      expect(badgeJSON).toHaveKey("ribbonText", subject.ribbonText());
    });
  });

  // describe("statusClass", function() {
  //   it("returns a lower-cased, hyphenated version of the model's status", function() {
  //     subject.model.set("status", "Some Status");
  //     subject.model.set("isFavorite", false);
  //     expect(subject.statusClass()).toEqual("some-status");
  //   });

  //   it("returns favorite if the model is a favorite", function() {
  //     subject.model.set("isFavorite", true);
  //     expect(subject.statusClass()).toEqual("favorite");
  //   });
  // });

  // describe("ribbonText", function() {
  //   it("returns a title case version of the model's status", function() {
  //     subject.model.set("status", "some status");
  //     subject.model.set("isFavorite", false);
  //     expect(subject.ribbonText()).toEqual("Some Status");
  //   });

  //   it("returns favorite if the model is a favorite", function() {
  //     subject.model.set("isFavorite", true);
  //     expect(subject.ribbonText()).toEqual("Favorite");
  //   });
  // });
});

describe("App.Views.Badges", function() {
  var subject;
  var badges;
  beforeEach(function() {
    affix("#container");
    badges = _.clone(FakeAPI.users.first().badges);
    subject = new App.Views.Badges({
      el: "#container",
      collection: new App.Collections.Badges(badges)
    });
  });

  it("has a modelName", function() {
    expect(subject.modelName).toEqual("Badge");
  });

  it("has a modelView", function() {
    expect(subject.modelView).toEqual(App.Views.Badge);
  });

  it("has a groups of property", function() {
    expect(subject.groupsOf).toBeNumber();
  });

  describe("lastInGroup", function() {
    var lastView;
    var firstView;
    beforeEach(function() {
      subject.createListItemViews();
      lastView = subject.modelViews[subject.groupsOf - 1];
      firstView = subject.modelViews[0];
    });

    it("determines if the given view is last in the group", function() {
      expect(subject.lastInGroup(lastView)).toBeTrue();
      expect(subject.lastInGroup(firstView)).toBeFalse();
    });

    describe("markLastInGroup", function() {
      beforeEach(function() {
        subject.markLastInGroup(lastView);
      });

      it("adds the omega class to the view", function() {
        expect(lastView.$el).toHaveClass("omega");
      });
    });
  });

  describe("renderDivider", function() {
    beforeEach(function() {
      subject.renderDivider();
    });

    it("appends a divider to the list", function() {
      expect(subject.$el.find(".divider").length).toEqual(1);
    });
  });

  describe("renderListItemViewGrouped", function() {
    var lastView;
    var firstView;

    beforeEach(function() {
      subject.createListItemViews();
      spyOn(subject, "renderDivider");
      lastView = subject.modelViews[subject.groupsOf - 1];
      firstView = subject.modelViews[0];
    });

    describe("when view is last in group", function() {
      beforeEach(function() {
        subject.renderListItemViewGrouped(lastView);
      });

      it("renders the divider", function() {
        expect(subject.renderDivider).toHaveBeenCalled();
      });

      it("marks the view as last", function() {
        expect(lastView.$el).toHaveClass("omega");
      });
    });

    describe("when view is not last in group", function() {
      beforeEach(function() {
        subject.renderListItemViewGrouped(firstView);
      });

      it("renders the divider", function() {
        expect(subject.renderDivider).not.toHaveBeenCalled();
      });

      it("marks the view as last", function() {
        expect(firstView.$el).not.toHaveClass("omega");
      });
    });
  });

  describe("renderListItemView", function() {
    beforeEach(function() {
      subject.createListItemView(subject.collection.first(), 0);
      spyOn(subject.$el, "append");
      spyOn(subject, "renderListItemViewGrouped");
      subject.renderListItemView(subject.modelViews.first());
    });

    it("renders the list item grouped", function() {
      expect(subject.renderListItemViewGrouped).toHaveBeenCalled();
    });
  });
});

describe("App.Views.CollectionView", function() {
  var subject;

  beforeEach(function() {
    affix("#container");
    App.Templates["templates/some_model_list_item"] = jasmine.createSpy();
    App.Templates["templates/some_model_list_item"].render = jasmine.createSpy();
    App.Templates["templates/some_model_list"] = jasmine.createSpy();
    App.Models.SomeModel = App.Models.BaseModel.extend({});
    App.Collections.SomeModels = App.Collections.BaseCollection.extend({
      model: App.Models.SomeModel
    });
    App.Views.SomeModelList = App.Views.BaseView.extend({});
    App.Views.SomeModelListItem = App.Views.BaseView.extend({});
    subject = new App.Views.CollectionView({
      el: "#container",
      modelName: "SomeModel",
      collection: new Backbone.Collection([{ id: 1 }, { id: 2 }])
    });
  });

  it("has a modelName", function() {
    expect(subject.modelName).toEqual("SomeModel");
  });

  it("has a modelClass", function() {
    expect(subject.modelClass).toEqual(App.Models.SomeModel);
  });

  it("has modelViews", function() {
    expect(subject.modelViews).toEqual([]);
  });

  it("has a modelView", function() {
    expect(subject.modelView).toEqual(App.Views.SomeModelListItem);
  });

  it("has a collection of models", function() {
    var withDefaultCollection = new App.Views.CollectionView({
      el: "#container",
      modelName: "SomeModel"
    });
    expect(withDefaultCollection.collection).toBeTypeof(App.Collections.SomeModels);
  });

  it("has an emptyTemplate", function() {
    expect(subject.emptyTemplate).toBeDefined();
    expect(subject.emptyTemplate({ modelName: "SomeModel" })).toEqual('<li class="empty">There are no somemodels</li>');
  });

  describe("with options", function() {
    var subject;
    var OptionalCollection;
    var OptionalView;
    var SomeModel;

    beforeEach(function() {
      OptionalCollection = App.Collections.BaseCollection.extend();
      OptionalView = Backbone.View.extend();
      OptionalModel = Backbone.Model.extend();
      SomeModel = Backbone.Model.extend();

      subject = new App.Views.CollectionView({
        el: "#container",
        modelName: "SomeModel",
        modelView: OptionalView,
        collection: new OptionalCollection
      });
    });

    it("accepts a collection", function() {
      expect(subject.collection).toBeTypeof(OptionalCollection);
    });

    it("accepsts a modelView", function() {
      expect(subject.modelView).toEqual(OptionalView);
    });

    describe("subclassed properties", function() {
      var subject;
      var SubclassedView;

      beforeEach(function() {
        SubclassedView = App.Views.CollectionView.extend({
          initialize: function() {
            this.modelName = "SomeModel";
            this.modelView = OptionalView,
            this.collection = new OptionalCollection;
            this.modelClass = SomeModel;
            App.Views.CollectionView.prototype.initialize.apply(this, arguments);
          }
        });
        subject = new SubclassedView();
      });

      it("defers to the subclass modelName", function() {
        expect(subject.modelName).toEqual("SomeModel");
      });

      it("defers to the subclass modelView", function() {
        expect(subject.modelView).toEqual(OptionalView);
      });

      it("defers to the subclass collection", function() {
        expect(subject.collection).toBeTypeof(OptionalCollection);
      });

      it("defers to the subclass modelClass", function() {
        expect(subject.modelClass).toEqual(SomeModel);
      });
    });
  });

  describe("render", function() {
    beforeEach(function() {
      spyOn(subject, "render").and.callThrough();
      spyOn(subject.$el, "empty");
      subject.render();
    });

    it("empties the element", function() {
      expect(subject.$el.empty).toHaveBeenCalled();
    });

    it("returns the element", function() {
      expect(subject.render()).toEqual(subject.$el);
    });

    describe("when collection is empty", function() {
      beforeEach(function() {
        spyOn(subject.$el, "html");
        spyOn(subject, "emptyTemplate").and.callThrough();
        subject.collection.reset();
        subject.render();
      });

      it("it renders the empty template", function() {
        expect(subject.$el.html).toHaveBeenCalledWith(subject.emptyTemplate({ modelName: subject.modelName }));
      });
    });
  });

  describe("modelViewName", function() {
    it("returns a model view name string", function() {
      expect(subject.modelViewName()).toEqual("SomeModelListItem");
    });
  });

  describe("createListItemView", function() {
    beforeEach(function() {
      spyOn(subject.modelView.prototype, "initialize").and.callThrough();
      subject.createListItemView(subject.collection.first(), 0);
    });

    it("adds a view to the modelViews", function() {
      expect(subject.modelViews.length).toEqual(1);
      expect(subject.modelViews.first()).toBeTypeof(App.Views.SomeModelListItem);
      expect(subject.modelView.prototype.initialize).toHaveBeenCalledWith({ model: subject.collection.first(), index: 0});
    });
  });

  describe("renderListItemView", function() {
    beforeEach(function() {
      subject.createListItemView(subject.collection.first(), 0);
      spyOn(subject.$el, "append");
      subject.renderListItemView(subject.modelViews.first());
    });

    it("appends the rendered list item view to the element", function() {
      expect(subject.$el.append).toHaveBeenCalledWith(subject.modelViews.first().render());
    });
  });

  describe("createListItemViews", function() {
    beforeEach(function() {
      subject.createListItemViews();
    });

    it("creates a list item view for each item", function() {
      expect(subject.modelViews.length).toEqual(subject.collection.length);
    });

    it("clears the modelViews array", function() {
      subject.createListItemViews();
      expect(subject.modelViews.length).toEqual(subject.collection.length);
    });
  });

  describe("renderListItemViews", function() {
    beforeEach(function() {
      subject.createListItemViews();
      spyOn(subject, "renderListItemView");
      subject.renderListItemViews();
    });

    it("renders each list item view", function() {
      expect(subject.renderListItemView.calls.count()).toEqual(subject.collection.length);
    });
  });

});

FakeServer.responseTime = 1;

describe("App.Views.Paginator", function() {
  var subject;
  var badgesAttributes;
  var badges
  beforeEach(function() {
    affix("#container");
    badgesAttributes = _.clone(FakeAPI.users.first().badges);
    badges = new App.Collections.Badges(badgesAttributes);
    subject = new App.Views.Paginator({
      el: "#container",
      collection: badges,
      totalCount: 50
    });
  });

  it("has a template", function() {
    expect(subject.template).toBeDefined();
    expect(subject.template).toEqual(App.Templates.paginator);
  });

  it("has a current page", function() {
    expect(subject.currentPage).toEqual(1);
  });

  it("sets the total count", function() {
    expect(subject.totalCount).toEqual(50);
  });

  it("sets the total count to 0 if not passed", function() {
    subject = new App.Views.Paginator({
      el: "#container",
      collection: badges
    });
    expect(subject.totalCount).toEqual(0);
  });

  describe("initialize", function() {
    beforeEach(function() {
      spyOn(_, "bindAll");
      spyOn(subject, "render");
      subject.initialize();
    });

    it("binds externally called methods", function() {
      expect(_.bindAll).toHaveBeenCalledWith(subject, "createPageObject", "toggleLoading", "handlePageFetchSuccess");
    });

    it("renders the view", function() {
      expect(subject.render).toHaveBeenCalled();
    });
  });

  describe("pageCount", function() {
    it("returns the length of the collection divided by the perPage value rounded up", function() {
      var pageCount = Math.ceil(badges.length / badges.perPage);
      expect(subject.pageCount()).toEqual(pageCount);
    });
  });

  describe("pages", function() {
    it("returns an array of page objects", function() {
      subject.pages().each(function(page, i) {
        var num = i + 1;
        var current = subject.currentPage === num;
        expect(page.number).toEqual(num);
        if (current) {
          expect(page.className).toEqual("current");
        } else {
          expect(page.className).toEqual("page");
        }
      });
    });
  });

  describe("render", function() {
    beforeEach(function() {
      spyOn(subject, "template").and.callThrough();
    });

    it("does nothing if the collection is empty", function() {
      subject.$el.empty();
      spyOn(subject.collection, "isEmpty").and.returnValue(true);
      subject.render();
      expect(subject.$el.children().length).toEqual(0);
    });

    it("renders the template", function() {
      subject.render();
      expect(subject.$el.children().length).toBeGreaterThan(0);
    });

    it("passes the page data to the template", function() {
      subject.render();
      expect(subject.template).toHaveBeenCalledWith({
        pages: subject.pages(),
        isNotFirstPage: subject.currentPage !== 1,
        isNotLastPage: subject.currentPage !== subject.pageCount()
      });
    });

    it("renders the page class names", function() {
      subject.render();
      expect(subject.$el.find(".page").length).toEqual(subject.pageCount() - 1);
      expect(subject.$el.find(".current").length).toEqual(1);
    });

    it("renders the page number as a data attribute", function() {
      subject.render();
      expect(subject.$el.find("a").eq(1).data()).toEqual({ pageNumber: 1 });
    });

    describe("on the first page", function() {
      it("renders a link for each page and the next link", function() {
        subject.render();
        expect(subject.$el.find("ul").children().length).toEqual(subject.pageCount() + 2);
        expect(subject.$el.find("a:first")).toHaveClass("spacer");
        expect(subject.$el.find("a:last")).toHaveClass("next");
      });
    });

    describe("on the last page", function() {
      it("renders a link for each page and the previous link", function() {
        subject.currentPage = subject.pageCount();
        subject.render();
        expect(subject.$el.find("ul").children().length).toEqual(subject.pageCount() + 2);
        expect(subject.$el.find("a:last")).toHaveClass("spacer");
        expect(subject.$el.find("a:first")).toHaveClass("previous");
      });
    });

    describe("on a middle page", function() {
      it("renders a link for each page and the previous and next link", function() {
        subject.currentPage = 2;
        subject.render();
        expect(subject.$el.find("ul").children().length).toEqual(subject.pageCount() + 2);
        expect(subject.$el.find("a:first")).toHaveClass("previous");
        expect(subject.$el.find("a:last")).toHaveClass("next");
      });
    });
  });

  describe("fetchPage", function() {
    beforeEach(function() {
      subject.currentPage = 5;
      spyOn(subject, "toggleLoading");
      spyOn(subject.collection, "fetch").and.returnValue(promiseStub);
      subject.fetchPage();
    });

    it("toggles loading", function() {
      expect(subject.toggleLoading).toHaveBeenCalled();
    });

    it("sets the page on the collection", function() {
      expect(subject.collection.page).toEqual(5);
    });

    it("fetches the collection", function() {
      expect(subject.collection.fetch).toHaveBeenCalled();
    });

    it("calls the handlePageFetchSuccess method", function() {
      expect(promiseStub.done).toHaveBeenCalledWith(subject.handlePageFetchSuccess);
    });
  });

  describe("handlePageClick", function() {
    var pageLink;
    beforeEach(function() {
      subject.render();
      spyOn(subject, "render");
      spyOn(subject, "fetchPage");
      pageLink = subject.$el.find("a").eq(2);
      eventStub.mixin({ target: pageLink[0] });
      subject.handlePageClick(eventStub);
    });

    it("sets the current page to the clicked page", function() {
      expect(subject.currentPage).toEqual(pageLink.data().pageNumber);
    });

    it("fetches the page", function() {
      expect(subject.fetchPage).toHaveBeenCalled();
    });
  });

  describe("handlePreviousClick", function() {
    var pageLink;
    beforeEach(function() {
      subject.currentPage = 3;
      subject.collection.page = 3;
      subject.render();
      spyOn(subject, "render");
      spyOn(subject, "fetchPage");
      pageLink = subject.$el.find(".previous");
      eventStub.mixin({ target: pageLink[0] });
      subject.handlePreviousClick(eventStub);
    });

    it("sets the current page to the previous page", function() {
      expect(subject.currentPage).toEqual(2);
    });

    it("fetches the page", function() {
      expect(subject.fetchPage).toHaveBeenCalled();
    });
  });

  describe("handleNextClick", function() {
    var pageLink;
    beforeEach(function() {
      spyOn(subject, "fetchPage");
      subject.currentPage = 2;
      subject.collection.page = 2;
      subject.render();
      pageLink = subject.$el.find(".next");
      eventStub.mixin({ target: pageLink[0] });
      subject.handleNextClick(eventStub);
    });

    it("sets the current page to the next page", function() {
      expect(subject.currentPage).toEqual(3);
    });

    it("fetches the page", function() {
      expect(subject.fetchPage).toHaveBeenCalled();
    });
  });

  describe("events", function() {
    beforeEach(function() {
      spyOn(subject.collection, "fetch").and.returnValue(promiseStub);
    });

    it("handles clicking the page links", function() {
      subject.render();
      var pagelink = subject.$el.find("a").eq(1).trigger("click");
      expect(subject.currentPage).toEqual(pagelink.data().pageNumber);
    });

    it("handles clicking the previous links", function() {
      subject.currentPage = 2;
      subject.render();
      var pagelink = subject.$el.find(".previous").trigger("click");
      expect(subject.currentPage).toEqual(1);
    });

    it("handles clicking the next links", function() {
      subject.currentPage = 2;
      subject.render();
      var pagelink = subject.$el.find(".next").trigger("click");
      expect(subject.currentPage).toEqual(3);
    });
  });
});
