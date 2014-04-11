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
      expect(subject.myBadges.children().length).toEqual(userAttributes.badges.length);
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
