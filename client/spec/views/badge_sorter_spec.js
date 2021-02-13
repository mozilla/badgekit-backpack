describe("App.Views.BadgeSorter", function() {
  var subject;
  var badges;
  beforeEach(function() {
    affix("#container");
    badges = new App.Collections.Badges(_.clone(FakeAPI.users.first().badges));
    subject = new App.Views.BadgeSorter({
      el: "#container",
      collection: badges
    });
  });

  it("has a template", function() {
    expect(subject.template).toBeDefined();
    expect(subject.template).toEqual(App.Templates.badge_sorter);
  });

  describe("initialize", function() {
    beforeEach(function() {
      spyOn(subject, "render");
      subject.render();
    });

    it("renders the template", function() {
      expect(subject.render).toHaveBeenCalled();
    });

    it("caches the select element", function() {
      expect(subject.selector).toEqual(subject.$el.find("select"));
    });
  });

  describe("render", function() {
    beforeEach(function() {
      subject.render();
    });

    it("renders the template", function() {
      expect(subject.$el.children().length).toBeGreaterThan(0);
    });
  });

  describe("events", function() {
    it("binds handleSelectChange to the select change event", function() {
      expect(subject.events["change select"]).toEqual("handleSelectChange");
    });
  });

  describe("handleSelectChange", function() {
    var sortVal;
    beforeEach(function() {
      spyOn(subject.collection, "fetch");
      sortVal = "issuedOn-asc";
      subject.$el.find("select").val(sortVal);
      subject.handleSelectChange();
    });

    it("sets the filters on the collection", function() {
      expect(subject.collection.filters).toHaveKey("sort", sortVal);
    });

    it("it fetches the collection", function() {
      expect(subject.collection.fetch).toHaveBeenCalled();
    });
  });
});
