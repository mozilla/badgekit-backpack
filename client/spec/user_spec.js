describe("App.Models.User", function() {
  var subject;
  var userAttributes;
  beforeEach(function() {
    userAttributes = _.clone(FakeAPI.users.first());
    subject = new App.Models.User(userAttributes);
  });

  it("has a urlRoot", function() {
    expect(subject.urlRoot).toEqual("/user");
    expect(subject.url()).toEqual("/user/" + subject.id);
  });

  describe("relationships", function() {
    it("wraps badges in a Badges collection", function() {
      expect(subject.get("badges")).toBeTypeof(App.Collections.Badges);
    });
  });
});
