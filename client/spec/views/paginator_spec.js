FakeServer.responseTime = 1;

describe("App.Views.Paginator", function() {
  var subject;
  var badgesAttributes;
  var badges
  beforeEach(function() {
    affix("#container");
    badgesAttributes = _.clone(FakeAPI.users.first().badges);
    badges = new App.Collections.Badges(badgesAttributes);
    badges.totalCount = 50;
    subject = new App.Views.Paginator({
      el: "#container",
      collection: badges
    });
  });

  it("has a template", function() {
    expect(subject.template).toBeDefined();
    expect(subject.template).toEqual(App.Templates.paginator);
  });

  it("has a current page", function() {
    expect(subject.currentPage).toEqual(1);
  });

  describe("initialize", function() {
    beforeEach(function() {
      spyOn(_, "bindAll");
      spyOn(subject, "render");
      subject.initialize();
    });

    it("binds externally called methods", function() {
      expect(_.bindAll).toHaveBeenCalledWith(subject, "createPageObject", "toggleLoading", "handlePageFetchSuccess");
    });

    it("renders the view", function() {
      expect(subject.render).toHaveBeenCalled();
    });
  });

  describe("pageCount", function() {
    it("returns the length of the collection divided by the perPage value rounded up", function() {
      badges.totalCount = 50;
      var pageCount = Math.ceil(badges.totalCount / badges.perPage);
      expect(subject.pageCount()).toEqual(pageCount);
    });
  });

  describe("pages", function() {
    it("returns an array of page objects", function() {
      subject.pages().each(function(page, i) {
        var num = i + 1;
        var current = subject.currentPage === num;
        expect(page.number).toEqual(num);
        if (current) {
          expect(page.className).toEqual("current");
        } else {
          expect(page.className).toEqual("page");
        }
      });
    });
  });

  describe("render", function() {
    beforeEach(function() {
      spyOn(subject, "template").and.callThrough();
    });

    it("does nothing if the collection is empty", function() {
      subject.$el.empty();
      spyOn(subject.collection, "isEmpty").and.returnValue(true);
      subject.render();
      expect(subject.$el.children().length).toEqual(0);
    });

    it("renders the template", function() {
      subject.render();
      expect(subject.$el.children().length).toBeGreaterThan(0);
    });

    it("passes the page data to the template", function() {
      subject.render();
      expect(subject.template).toHaveBeenCalledWith({
        pages: subject.pages(),
        isNotFirstPage: subject.currentPage !== 1,
        isNotLastPage: subject.currentPage !== subject.pageCount()
      });
    });

    it("renders the page class names", function() {
      subject.render();
      expect(subject.$el.find(".page").length).toEqual(subject.pageCount() - 1);
      expect(subject.$el.find(".current").length).toEqual(1);
    });

    it("renders the page number as a data attribute", function() {
      subject.render();
      expect(subject.$el.find("a").eq(1).data()).toEqual({ pageNumber: 1 });
    });

    describe("on the first page", function() {
      it("renders a link for each page and the next link", function() {
        subject.render();
        expect(subject.$el.find("ul").children().length).toEqual(subject.pageCount() + 2);
        expect(subject.$el.find("a:first")).toHaveClass("spacer");
        expect(subject.$el.find("a:last")).toHaveClass("next");
      });
    });

    describe("on the last page", function() {
      it("renders a link for each page and the previous link", function() {
        subject.currentPage = subject.pageCount();
        subject.render();
        expect(subject.$el.find("ul").children().length).toEqual(subject.pageCount() + 2);
        expect(subject.$el.find("a:last")).toHaveClass("spacer");
        expect(subject.$el.find("a:first")).toHaveClass("previous");
      });
    });

    describe("on a middle page", function() {
      it("renders a link for each page and the previous and next link", function() {
        subject.currentPage = 2;
        subject.render();
        expect(subject.$el.find("ul").children().length).toEqual(subject.pageCount() + 2);
        expect(subject.$el.find("a:first")).toHaveClass("previous");
        expect(subject.$el.find("a:last")).toHaveClass("next");
      });
    });
  });

  describe("fetchPage", function() {
    beforeEach(function() {
      subject.currentPage = 5;
      spyOn(subject, "toggleLoading");
      spyOn(subject.collection, "fetch").and.returnValue(promiseStub);
      subject.fetchPage();
    });

    it("toggles loading", function() {
      expect(subject.toggleLoading).toHaveBeenCalled();
    });

    it("sets the page on the collection", function() {
      expect(subject.collection.page).toEqual(5);
    });

    it("fetches the collection", function() {
      expect(subject.collection.fetch).toHaveBeenCalled();
    });

    it("calls the handlePageFetchSuccess method", function() {
      expect(promiseStub.done).toHaveBeenCalledWith(subject.handlePageFetchSuccess);
    });
  });

  describe("handlePageClick", function() {
    var pageLink;
    beforeEach(function() {
      subject.render();
      spyOn(subject, "render");
      spyOn(subject, "fetchPage");
      pageLink = subject.$el.find("a").eq(2);
      eventStub.mixin({ target: pageLink[0] });
      subject.handlePageClick(eventStub);
    });

    it("sets the current page to the clicked page", function() {
      expect(subject.currentPage).toEqual(pageLink.data().pageNumber);
    });

    it("fetches the page", function() {
      expect(subject.fetchPage).toHaveBeenCalled();
    });
  });

  describe("handlePreviousClick", function() {
    var pageLink;
    beforeEach(function() {
      subject.currentPage = 3;
      subject.collection.page = 3;
      subject.render();
      spyOn(subject, "render");
      spyOn(subject, "fetchPage");
      pageLink = subject.$el.find(".previous");
      eventStub.mixin({ target: pageLink[0] });
      subject.handlePreviousClick(eventStub);
    });

    it("sets the current page to the previous page", function() {
      expect(subject.currentPage).toEqual(2);
    });

    it("fetches the page", function() {
      expect(subject.fetchPage).toHaveBeenCalled();
    });
  });

  describe("handleNextClick", function() {
    var pageLink;
    beforeEach(function() {
      spyOn(subject, "fetchPage");
      subject.currentPage = 2;
      subject.collection.page = 2;
      subject.render();
      pageLink = subject.$el.find(".next");
      eventStub.mixin({ target: pageLink[0] });
      subject.handleNextClick(eventStub);
    });

    it("sets the current page to the next page", function() {
      expect(subject.currentPage).toEqual(3);
    });

    it("fetches the page", function() {
      expect(subject.fetchPage).toHaveBeenCalled();
    });
  });

  describe("events", function() {
    beforeEach(function() {
      spyOn(subject.collection, "fetch").and.returnValue(promiseStub);
    });

    it("handles clicking the page links", function() {
      subject.render();
      var pagelink = subject.$el.find("a").eq(1).trigger("click");
      expect(subject.currentPage).toEqual(pagelink.data().pageNumber);
    });

    it("handles clicking the previous links", function() {
      subject.currentPage = 2;
      subject.render();
      var pagelink = subject.$el.find(".previous").trigger("click");
      expect(subject.currentPage).toEqual(1);
    });

    it("handles clicking the next links", function() {
      subject.currentPage = 2;
      subject.render();
      var pagelink = subject.$el.find(".next").trigger("click");
      expect(subject.currentPage).toEqual(3);
    });
  });
});
