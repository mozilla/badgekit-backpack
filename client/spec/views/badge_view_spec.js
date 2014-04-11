describe("App.Views.Badge", function() {
  var subject;
  var badgeAttributes;
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

  describe("render", function() {
    beforeEach(function() {
      subject.render();
    });

    it("renders the model data in the template", function() {
      expect(subject.$el.find(".description")).toHaveText(badgeAttributes.description);
      expect(subject.$el.find("img")).toHaveAttribute("src", badgeAttributes.imageUrl);
      expect(subject.$el.find(".ribbon")).toHaveText(badgeAttributes.status);
    });
  });
});
