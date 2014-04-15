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
