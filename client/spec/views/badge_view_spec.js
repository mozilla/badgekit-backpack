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

  it("has a description length", function() {
    expect(subject.descriptionLength).toBeNumber();
  });

  describe("render", function() {
    beforeEach(function() {
      badgeJSON = subject.badgeJSON();
      subject.render();
    });

    it("renders the model data in the template", function() {
      expect(subject.$el.find(".inner")).toHaveClass(badgeJSON.statusClass);
      expect(subject.$el.find(".description")).toHaveText(badgeJSON.description);
      expect(subject.$el.find("img")).toHaveAttribute("src", badgeJSON.imageUrl);
      expect(subject.$el.find(".ribbon")).toHaveText(badgeJSON.ribbonText);
    });
  });

  describe("badgeJSON", function() {
    beforeEach(function() {
      badgeJSON = subject.badgeJSON();
    });

    it("returns an object of the model attributes", function() {
      expect(badgeJSON).toHaveKey("name", subject.model.get("name"));
      expect(badgeJSON).toHaveKey("status", subject.model.get("status"));
      expect(badgeJSON).toHaveKey("imageUrl", subject.model.get("imageUrl"));
      expect(badgeJSON).toHaveKey("description", subject.model.get("description").truncate(subject.descriptionLength));
      expect(badgeJSON).toHaveKey("statusClass", subject.statusClass());
      expect(badgeJSON).toHaveKey("ribbonText", subject.ribbonText());
    });
  });

  // describe("statusClass", function() {
  //   it("returns a lower-cased, hyphenated version of the model's status", function() {
  //     subject.model.set("status", "Some Status");
  //     subject.model.set("isFavorite", false);
  //     expect(subject.statusClass()).toEqual("some-status");
  //   });

  //   it("returns favorite if the model is a favorite", function() {
  //     subject.model.set("isFavorite", true);
  //     expect(subject.statusClass()).toEqual("favorite");
  //   });
  // });

  // describe("ribbonText", function() {
  //   it("returns a title case version of the model's status", function() {
  //     subject.model.set("status", "some status");
  //     subject.model.set("isFavorite", false);
  //     expect(subject.ribbonText()).toEqual("Some Status");
  //   });

  //   it("returns favorite if the model is a favorite", function() {
  //     subject.model.set("isFavorite", true);
  //     expect(subject.ribbonText()).toEqual("Favorite");
  //   });
  // });
});
