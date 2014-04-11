describe("App.Views.Badges", function() {
  var subject;
  var badges;
  beforeEach(function() {
    affix("#container");
    badges = _.clone(FakeAPI.users.first().badges);
    subject = new App.Views.Badges({
      el: "#container",
      collection: new App.Collections.Badges(badges)
    });
  });

  it("has a modelName", function() {
    expect(subject.modelName).toEqual("Badge");
  });

  it("has a modelView", function() {
    expect(subject.modelView).toEqual(App.Views.Badge);
  });

  it("has a groups of property", function() {
    expect(subject.groupsOf).toBeNumber();
  });

  describe("lastInGroup", function() {
    var lastView;
    var firstView;
    beforeEach(function() {
      subject.createListItemViews();
      lastView = subject.modelViews[subject.groupsOf - 1];
      firstView = subject.modelViews[0];
    });

    it("determines if the given view is last in the group", function() {
      expect(subject.lastInGroup(lastView)).toBeTrue();
      expect(subject.lastInGroup(firstView)).toBeFalse();
    });

    describe("markLastInGroup", function() {
      beforeEach(function() {
        subject.markLastInGroup(lastView);
      });

      it("adds the omega class to the view", function() {
        expect(lastView.$el).toHaveClass("omega");
      });
    });
  });

  describe("renderDivider", function() {
    beforeEach(function() {
      subject.renderDivider();
    });

    it("appends a divider to the list", function() {
      expect(subject.$el.find(".divider").length).toEqual(1);
    });
  });

  describe("renderListItemViewGrouped", function() {
    var lastView;
    var firstView;

    beforeEach(function() {
      subject.createListItemViews();
      spyOn(subject, "renderDivider");
      lastView = subject.modelViews[subject.groupsOf - 1];
      firstView = subject.modelViews[0];
    });

    describe("when view is last in group", function() {
      beforeEach(function() {
        subject.renderListItemViewGrouped(lastView);
      });

      it("renders the divider", function() {
        expect(subject.renderDivider).toHaveBeenCalled();
      });

      it("marks the view as last", function() {
        expect(lastView.$el).toHaveClass("omega");
      });
    });

    describe("when view is not last in group", function() {
      beforeEach(function() {
        subject.renderListItemViewGrouped(firstView);
      });

      it("renders the divider", function() {
        expect(subject.renderDivider).not.toHaveBeenCalled();
      });

      it("marks the view as last", function() {
        expect(firstView.$el).not.toHaveClass("omega");
      });
    });
  });

  describe("renderListItemView", function() {
    beforeEach(function() {
      subject.createListItemView(subject.collection.first(), 0);
      spyOn(subject.$el, "append");
      spyOn(subject, "renderListItemViewGrouped");
      subject.renderListItemView(subject.modelViews.first());
    });

    it("renders the list item grouped", function() {
      expect(subject.renderListItemViewGrouped).toHaveBeenCalled();
    });
  });
});
