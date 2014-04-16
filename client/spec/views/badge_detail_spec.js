describe("App.Views.BadgeDetail", function() {
  var subject;
  var badge;
  beforeEach(function() {
    affix("#container");
    badge = new App.Models.Badge(_.clone(FakeAPI.users.first().badges.first()));
    subject = new App.Views.BadgeDetail({
      el: "#container",
      model: badge
    });
  });

  it("has a template", function() {
    expect(subject.template).toBeDefined();
  });

  it("has an id", function() {
    expect(subject.id).toEqual("badge-detail");
  });

  it("is a div", function() {
    expect(subject.tagName).toEqual("div");
  });

});
