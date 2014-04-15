describe("App.Views.BadgeFilter", function() {
  var subject;
  beforeEach(function() {
    subject = new App.Views.BadgeFilter;
  });

  it("has a template", function() {
    expect(subject.template).toBeDefined();
    expect(subject.template).toEqual(App.Templates.badge_filter);
  });

  describe("initialize", function() {
    beforeEach(function() {
      spyOn(subject, "render");
      subject.initialize();
    });

    it("renders the view", function() {
      expect(subject.render).toHaveBeenCalled();
    });
  });

  describe("render", function() {
    beforeEach(function() {
      subject.render();
    });

    it("renders the template", function() {
      expect(subject.$el.children().length).toBeGreaterThan(0);
    });
  });
});
