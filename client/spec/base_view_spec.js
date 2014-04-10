describe("App.Views.BaseView", function() {
  var subject;
  var $element;

  beforeEach(function() {
    affix("#container");
    $element = affix("#element");
    subject = new App.Views.BaseView({ el: "#container" });
  });

  describe("initialize", function() {
    it("has an index if passed", function() {
      subject = new App.Views.BaseView({ el: "#container", index: 3 });
      expect(subject.index).toEqual(3);
    });
  });

  describe("toggleLoading", function() {
    beforeEach(function() {
      subject.toggleLoading();
    });

    it("sets the isLoading flag", function() {
      expect(subject.isLoading).toBeTrue();
    });

    it("adds the loading class", function() {
      expect(subject.$el).toHaveClass("loading");
    });

    it("creates a loading mask", function() {
      expect(subject.$el.find(".loading-mask")).toExist();
      expect(subject.loadingMask).toBeJqueryWrapped();
    });

    describe("already loading", function() {
      beforeEach(function() {
        subject.toggleLoading();
      });

      it("sets isLoading to false", function() {
        expect(subject.isLoading).toBeFalse();
      });

      it("removes the loading mask", function() {
        expect(subject.$el.find(".loading-mask")).not.toExist();
        expect(subject.loadingMask).toBeUndefined();
      });

      it("removes the loading class", function() {
        expect(subject.$el).not.toHaveClass("loading");
      });
    });

    describe("with element", function() {
      it("sets the isLoading flag", function() {
        subject.toggleLoading($element);
        expect($element.isLoading).toBeTrue();
      });
    });
  });
});
