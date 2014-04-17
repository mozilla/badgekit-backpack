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

  describe("render", function() {
    beforeEach(function() {
      badgeJSON = subject.badgeJSON();
      subject.render();
    });

    it("renders the model data in the template", function() {
      expect(subject.$el.find("img")).toHaveAttribute("src", badgeJSON.imageUrl);
    });
  });

  describe("badgeJSON", function() {
    beforeEach(function() {
      badgeJSON = subject.badgeJSON();
    });

    it("returns an object of the model attributes", function() {
      expect(badgeJSON).toHaveKey("name", subject.model.get("name"));
      expect(badgeJSON).toHaveKey("imageUrl", subject.model.get("imageUrl"));
      expect(badgeJSON).toHaveKey("description", subject.model.get("description"));
    });
  });
});
