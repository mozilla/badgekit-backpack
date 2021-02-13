describe("App.Models.Badge", function() {
  var subject;
  var badgeAttributes;
  beforeEach(function() {
    badgeAttributes = _.clone(FakeAPI.users.first().badges.first());
    subject = new App.Models.Badge(badgeAttributes);
  });

  it("has STATUSES", function() {
    expect(App.Models.Badge.STATUSES).toEqual(["awarded", "in queue", "reviewed"]);
  });

  it("has TYPES", function() {
    expect(App.Models.Badge.TYPES).toEqual(['Community', 'Skill', 'Knowledge', 'Showcase']);
  });

  it("has a urlRoot", function() {
    expect(subject.urlRoot()).toEqual("/user/" + subject.get("earnerId") + "/badges/" + subject.id);
  });

  describe("parse", function() {
    var parsedAttributes;
    beforeEach(function() {
      parsedAttributes = subject.parse(badgeAttributes);
    });

    it("converts dates to moment objects", function() {
      expect(parsedAttributes.createdOn).toBeTypeof(moment().constructor);
      expect(parsedAttributes.issuedOn).toBeTypeof(moment().constructor);
      expect(parsedAttributes.expires).toBeTypeof(moment().constructor);
    });
  });
});

describe("App.Collections.Badges", function() {
  var subject;
  beforeEach(function() {
    subject = new App.Collections.Badges;
  });

  it("has a page", function() {
    expect(subject.page).toEqual(1);
  });

  it("has a perPage value", function() {
    expect(subject.perPage).toBeNumber();
  });

  describe("when there is no user id", function() {
    beforeEach(function() {
      subject = new App.Collections.Badges();
    });

    it("has an empty url", function() {
      expect(subject.url()).toBeUndefined();
    });
  });

  describe("parse", function() {
    var totalCount;
    var badges;
    var parsedAttributes;
    beforeEach(function() {
      totalCount = 5;
      badges = [{ id: 1 }];
      parsedAttributes = subject.parse({
        totalCount: totalCount,
        badges: badges
      });
    });

    it("sets the totalCount", function() {
      expect(subject.totalCount).toEqual(totalCount);
    });

    it("returns the badges", function() {
      expect(parsedAttributes).toEqual(badges);
    });
  });

  describe("when there is a userId", function() {
    var badgeAttributes;
    var userId;
    beforeEach(function() {
      badgeAttributes = FakeAPI.users.first().badges.first();
      subject = new App.Collections.Badges([badgeAttributes]);
      userId = 1;
      subject.userId = userId;
    });

    it("has a url", function() {
      var expectedURL = "/user/" + subject.userId + "/badges?page=" + subject.page + "&perPage=" + subject.perPage;
      expect(subject.url()).toEqual(expectedURL);
    });
  });
});
