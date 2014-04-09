describe("App", function() {
  var subject;
  beforeEach(function() {
    subject = App;
  });

  it("has a Models namespace", function() {
    expect(subject.Models).toBeObject();
  });
});
