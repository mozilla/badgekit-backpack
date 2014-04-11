describe("App", function() {
  var subject;
  beforeEach(function() {
    subject = App;
  });

  it("has a Models namespace", function() {
    expect(subject.Models).toBeObject();
  });

  it("has a Collections namespace", function() {
    expect(subject.Collections).toBeObject();
  });

  it("has a Views namespace", function() {
    expect(subject.Views).toBeObject();
  });

  it("has a Controllers namespace", function() {
    expect(subject.Views).toBeObject();
  });

  it("has a Dispatcher", function() {
    expect(subject.Dispatcher).toBeDefined();
    expect(subject.Dispatcher.on).toBeDefined();
    expect(subject.Dispatcher.off).toBeDefined();
    expect(subject.Dispatcher.trigger).toBeDefined();
  });
});
