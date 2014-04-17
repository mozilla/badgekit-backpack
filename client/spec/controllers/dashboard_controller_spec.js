describe("App.Controllers.Dashboard", function() {
  var subject;
  var userAttributes;
  var $badgeIndex;
  var $badgesContainer;
  var $badgeContainer;
  var $badgeShow;
  beforeEach(function() {
    userAttributes = _.clone(FakeAPI.users.first());
    $badgeIndex = affix("#badge-index");
    $badgesContainer = affix("#badges-container");
    $badgeContainer = affix("#badge-container");
    $badgeShow = affix("#badge-show");
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
        spyOn(subject, "registerIndexEvents");
        subject.initIndex({ id: 1 });
      });

      it("caches the index elements", function() {
        expect(subject.cacheIndexElements).toHaveBeenCalled();
      });

      it("sets the user", function() {
        expect(subject.user).toBeTypeof(App.Models.User);
        expect(subject.user.id).toEqual(1);
      });

      it("sets the badges", function() {
        expect(subject.badges).toEqual(subject.user.get("badges"));
      });

      it("fetches the user", function() {
        expect(subject.fetchBadges).toHaveBeenCalled();
      });

      it("creates a badges list view", function() {
        expect(subject.badgesView).toBeTypeof(App.Views.Badges);
      });

      it("creates a badge detail view", function() {
        expect(subject.badgeDetailView).toBeTypeof(App.Views.BadgeDetail);
      });

      it("registers the index events", function() {
        expect(subject.registerIndexEvents).toHaveBeenCalled();
      });
    });

    describe("cacheIndexElements", function() {
      beforeEach(function() {
        subject.cacheIndexElements();
      });

      it("has a badgeIndex reference", function() {
        expect(subject.badgeIndex).toBeJqueryWrapped("#badge-index");
      });

      it("has a badgesContainer reference", function() {
        expect(subject.badgesContainer).toBeJqueryWrapped("#badges-container");
      });

      it("has a badgeContainer reference", function() {
        expect(subject.badgeContainer).toBeJqueryWrapped("#badge-container");
      });

      it("has a badgeShow reference", function() {
        expect(subject.badgeShow).toBeJqueryWrapped("#badge-show");
      });
    });

    describe("fetchBadges", function() {
      beforeEach(function() {
        subject.user = new App.Models.User({ id: 1 });
        spyOn(subject.badges, "fetch").and.returnValue(promiseStub);
        subject.fetchBadges();
      });

      it("fetches the user", function() {
        expect(subject.badges.fetch).toHaveBeenCalled();
      });

      it("calls handleBadgesFetchSuccess when done", function() {
        expect(promiseStub.done).toHaveBeenCalledWith(subject.handleBadgesFetchSuccess);
      });

      it("calls handleBadgeFetchFailure when it fails", function() {
        expect(promiseStub.fail).toHaveBeenCalledWith(subject.handleBadgeFetchFailure);
      });
    });

    describe("registerIndexEvents", function() {
      beforeEach(function() {
        spyOn(subject, "handleShowBadge");
        spyOn(subject, "handleIndex");
        subject.registerIndexEvents();
      });

      it("registers handleShowBadge to the showBadge event", function() {
        App.Dispatcher.trigger("showBadge", 1);
        expect(subject.handleShowBadge).toHaveBeenCalled();
      });

      it("registers handleIndex to the index event", function() {
        App.Dispatcher.trigger("index");
        expect(subject.handleIndex).toHaveBeenCalled();
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
        expect(subject.badgePaginator.collection).toEqual(subject.badges);
      });
    });

    describe("handleBadgeFetchFailure", function() {
      beforeEach(function() {
        subject.handleBadgeFetchFailure();
      });

      it("renders an error message", function() {
        expect(subject.badgesView.$el).toHaveText("There was an error fetching your badges");
      });
    });

    describe("handleShowBadge", function() {
      beforeEach(function() {
        subject.badges = new App.Collections.Badges(_.clone(userAttributes.badges.first()));
        subject.handleShowBadge(1);
      });

      it("finds the model by id", function() {
        expect(subject.badgeDetailView.model).toEqual(subject.badges.findWhere({ id: 1 }));
      });

      it("renders the detail view", function() {
        expect(subject.badgeContainer.find("#badge-detail").length).toBeGreaterThan(0);
      });
    });

    describe("createPaginationView", function() {
      beforeEach(function() {
        subject.badgePaginator = undefined;
        spyOn(subject, "renderBadgePagination");
        subject.createPaginationView();
      });

      it("creates a pagination view", function() {
        expect(subject.badgePaginator).toBeTypeof(App.Views.Paginator);
      });

      it("renders the badgePaginator", function() {
        expect(subject.renderBadgePagination).toHaveBeenCalled();
      });
    });

    describe("createBadgeFilterView", function() {
      beforeEach(function() {
        subject.badgeFilter = undefined;
        spyOn(subject, "renderBadgeFilter");
        subject.createBadgeFilterView();
      });

      it("creates a badge filter view", function() {
        expect(subject.badgeFilter).toBeTypeof(App.Views.BadgeFilter);
      });

      it("renders the badge filters", function() {
        expect(subject.renderBadgeFilter).toHaveBeenCalled();
      });
    });

    describe("renderBadges", function() {
      beforeEach(function() {
        subject.user = new App.Models.User(userAttributes);
        subject.badgesView.collection = subject.user.get("badges");
        subject.cacheIndexElements();
        subject.renderBadges();
      });

      it("creates a badges view", function() {
        expect(subject.badgesView).toBeTypeof(App.Views.Badges);
      });

      it("renders the badges view", function() {
        var size = userAttributes.badges.length;
        var expectedChildCount = Math.floor(size + (size / 4));

        expect(subject.badgesView.$el.children().length).toEqual(expectedChildCount);
      });

      it("appends the badges view to the badge-index element", function() {
        expect($badgesContainer.children().length).toBeGreaterThan(0);
        expect($badgesContainer.find("#my-badges").length).toBeGreaterThan(0);
      });
    });

    describe("renderBadgeDetail", function() {
      beforeEach(function() {
        subject.badgeContainer = $badgeContainer;
        subject.badgeDetailView.model = new App.Models.Badge(_.clone(FakeAPI.users.first().badges.first()));
        subject.renderBadgeDetail();
      });

      it("renders the badge detail into the badgeIndex", function() {
        expect($badgeContainer.children().length).toBeGreaterThan(0);
        expect($badgeContainer.find("#badge-detail").length).toBeGreaterThan(0);
      });
    });

    describe("renderBadgePagination", function() {
      beforeEach(function() {
        subject.badgesContainer = $badgesContainer;
        subject.badgePaginator.collection = new App.Collections.Badges(_.clone(userAttributes.badges));
        subject.renderBadgePagination();
      });

      it("renders the badge pagiantion into the badgesContainer", function() {
        expect($badgesContainer.children().length).toBeGreaterThan(0);
        expect($badgesContainer.find("#badges-pagination").length).toBeGreaterThan(0);
      });
    });

    describe("renderBadgeFilter", function() {
      beforeEach(function() {
        subject.badgesContainer = $badgesContainer;
        subject.badgeFilter.collection = new App.Collections.Badges(_.clone(userAttributes.badges));
        subject.renderBadgeFilter();
      });

      it("renders the badge pagiantion into the badgesContainer", function() {
        expect($badgesContainer.children().length).toBeGreaterThan(0);
        expect($badgesContainer.find("#badge-filter").length).toBeGreaterThan(0);
      });
    });
  });
});
