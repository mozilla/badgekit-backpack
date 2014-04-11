describe("App.Views.Badges", function() {
  var subject;
  beforeEach(function() {
    subject = new App.Views.Badges;
  });

  it("has a modelName", function() {
    expect(subject.modelName).toEqual("Badge");
  });

  it("has a modelView", function() {
    expect(subject.modelView).toEqual(App.Views.Badge);
  });
});
