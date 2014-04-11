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

describe("App.Models.User", function() {
  var subject;
  var userAttributes;
  beforeEach(function() {
    userAttributes = _.clone(FakeAPI.users.first());
    subject = new App.Models.User(userAttributes);
  });

  it("has a urlRoot", function() {
    expect(subject.urlRoot).toEqual("/user");
    expect(subject.url()).toEqual("/user/" + subject.id);
  });

  describe("relationships", function() {
    it("wraps badges in a Badges collection", function() {
      expect(subject.get("badges")).toBeTypeof(App.Collections.Badges);
    });
  });
});

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

describe("App.Controllers.Dashboard", function() {
  var subject;
  var userAttributes;
  beforeEach(function() {
    userAttributes = _.clone(FakeAPI.users.first());
    affix("#my-badges");
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

  describe("cacheIndexElements", function() {
    beforeEach(function() {
      subject.cacheIndexElements();
    });

    it("has a myBadges reference", function() {
      expect(subject.myBadges).toBeJqueryWrapped("#my-badges");
    });
  });

  describe("renderBadges", function() {
    beforeEach(function() {
      App.CurrentUser = new App.Models.User(userAttributes);
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

  describe("renderBadgeFetchFailure", function() {
    beforeEach(function() {
      subject.renderBadgeFetchFailure();
    });

    it("renders an error message", function() {
      expect(subject.myBadges).toHaveText("There was an error fetching your badges");
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

  it("has a urlRoot", function() {
    expect(subject.urlRoot()).toEqual("/user/" + subject.get("earnerId") + "/badges/" + subject.id);
  });
});

describe("App.Collections.Badges", function() {
  var subject;

  describe("when empty", function() {
    beforeEach(function() {
      subject = new App.Collections.Badges();
    });

    it("has an empty url", function() {
      expect(subject.url()).toBeUndefined();
    });
  });

  describe("when not empty", function() {
    var badgeAttributes;
    beforeEach(function() {
      badgeAttributes = FakeAPI.users.first().badges.first();
      subject = new App.Collections.Badges([badgeAttributes]);
    });

    it("has a url", function() {
      expect(subject.url()).toEqual("/user/" + subject.first().get("earnerId") + "/badges");
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

describe("App.Views.BaseView", function() {
  var subject;
  var $element;

  beforeEach(function() {
    affix("#container");
    $element = affix("#element");
    subject = new App.Views.BaseView({ el: "#container" });
  });

  describe("initialize", function() {
    it("has an index if passed", function() {
      subject = new App.Views.BaseView({ el: "#container", index: 3 });
      expect(subject.index).toEqual(3);
    });
  });

  describe("toggleLoading", function() {
    beforeEach(function() {
      subject.toggleLoading();
    });

    it("sets the isLoading flag", function() {
      expect(subject.isLoading).toBeTrue();
    });

    it("adds the loading class", function() {
      expect(subject.$el).toHaveClass("loading");
    });

    it("creates a loading mask", function() {
      expect(subject.$el.find(".loading-mask")).toExist();
      expect(subject.loadingMask).toBeJqueryWrapped();
    });

    describe("already loading", function() {
      beforeEach(function() {
        subject.toggleLoading();
      });

      it("sets isLoading to false", function() {
        expect(subject.isLoading).toBeFalse();
      });

      it("removes the loading mask", function() {
        expect(subject.$el.find(".loading-mask")).not.toExist();
        expect(subject.loadingMask).toBeUndefined();
      });

      it("removes the loading class", function() {
        expect(subject.$el).not.toHaveClass("loading");
      });
    });

    describe("with element", function() {
      it("sets the isLoading flag", function() {
        subject.toggleLoading($element);
        expect($element.isLoading).toBeTrue();
      });
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
