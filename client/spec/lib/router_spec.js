describe("App.Router", function() {
  var subject;
  beforeEach(function() {
    subject = App.Router;
  });

  it("has a badge detail route", function() {
    expect(subject.routes["badge/:id"]).toEqual("showBadge");
  });
});
