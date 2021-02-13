describe("App.Models.User", function() {
  var subject;
  beforeEach(function() {
    subject = new App.Models.User({ id: 1 });
  });

  it("has a urlRoot", function() {
    expect(subject.urlRoot).toEqual("/user");
    expect(subject.url()).toEqual("/user/" + subject.id);
  });

  it("creates an empty badges collection", function() {
    expect(subject.get("badges")).toBeTypeof(App.Collections.Badges);
  });

  it("sets the userId on the badge collection", function() {
    expect(subject.get("badges").userId).toEqual(subject.id);
  });

  describe("relationships", function() {
    var userAttributes;
    beforeEach(function() {
      userAttributes = _.clone(FakeAPI.users.first());
      subject = new App.Models.User(userAttributes);
    });

    it("wraps badges in a Badges collection", function() {
      expect(subject.get("badges")).toBeTypeof(App.Collections.Badges);
    });
  });
});
