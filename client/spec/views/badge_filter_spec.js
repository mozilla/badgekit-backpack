describe("App.Views.BadgeFilter", function() {
  var subject;
  var collection;
  beforeEach(function() {
    affix("#container");
    collection = new App.Collections.Badges;
    subject = new App.Views.BadgeFilter({
      el: "#container",
      collection: collection
    });
  });

  xit("has a template", function() {
    expect(subject.template).toBeDefined();
    expect(subject.template).toEqual(App.Templates.badge_filter);
  });

  xit("is a section tag", function() {
    expect(subject.tagName).toEqual("section");
  });

  xit("has a badge-filter id", function() {
    expect(subject.id).toEqual("badge-filter");
  });

  describe("initialize", function() {
    beforeEach(function() {
      spyOn(subject, "render");
      subject.initialize();
    });

    xit("sets onBeforeFetch to a noop by default", function() {
      expect(subject.onBeforeFetch).toEqual($.noop);
    });

    xit("sets onAfterFetch to a noop by default", function() {
      expect(subject.onAfterFetch).toEqual($.noop);
    });

    describe("options", function() {
      var onBeforeFetchSpy;
      var onAfterFetchSpy;
      beforeEach(function() {
        onBeforeFetchSpy = jasmine.createSpy();
        onAfterFetchSpy = jasmine.createSpy();
        subject = new App.Views.BadgeFilter({
          el: "#container",
          collection: collection,
          onBeforeFetch: onBeforeFetchSpy,
          onAfterFetch: onAfterFetchSpy
        });
      });

      xit("sets the onBeforeFetch callback", function() {
        expect(subject.onBeforeFetch).toEqual(onBeforeFetchSpy);
      });

      xit("sets the onAfterFetch callback", function() {
        expect(subject.onAfterFetch).toEqual(onAfterFetchSpy);
      });
    });
  });

  describe("render", function() {
    beforeEach(function() {
      spyOn(subject, "cacheElements").and.callThrough();
      spyOn(subject, "initializeDatepicker");
      subject.render();
    });

    xit("renders the template", function() {
      expect(subject.$el.children().length).toBeGreaterThan(0);
    });

    xit("passes the badge statuses to the template", function() {
      App.Models.Badge.STATUSES.each(function(status) {
        expect(subject.$el.find('[name="filter-badge-status"] option').text()).toMatch(status);
      });
    });

    xit("passes the badge types to the template", function() {
      App.Models.Badge.TYPES.each(function(type) {
        expect(subject.$el.find('[name="filter-badge-type"] option').text()).toMatch(type);
      });
    });

    xit("caches the elements", function() {
      expect(subject.cacheElements).toHaveBeenCalled();
    });

    xit("initializes the datepicker", function() {
      expect(subject.initializeDatepicker).toHaveBeenCalled();
    });
  });

  describe("cacheElements", function() {
    beforeEach(function() {
      subject.render();
      subject.cacheElements();
    });

    xit("caches a reference to the status select", function() {
      expect(subject.statusSelect).toBeJqueryWrapped("#filter-badge-status-select");
    });

    xit("caches a reference to the type select", function() {
      expect(subject.typeSelect).toBeJqueryWrapped("#filter-badge-type-select");
    });

    xit("caches a reference to the category select", function() {
      expect(subject.categorySelect).toBeJqueryWrapped("#filter-badge-category-select");
    });

    xit("caches a reference to the date field", function() {
      expect(subject.dateField).toBeJqueryWrapped("#filter-badge-date-field");
    });
  });

  describe("initializeDatepicker", function() {
    beforeEach(function() {
      subject.render();
      spyOn(subject.dateField, "datepicker");
      subject.initializeDatepicker();
    });

    xit("initializes the datepicker on the dateField", function() {
      expect(subject.dateField.datepicker).toHaveBeenCalled();
    });
  });

  describe("getFilters", function() {
    var filters;
    beforeEach(function() {
      subject.render();
      subject.statusSelect.val(App.Models.Badge.STATUSES.last());
      subject.typeSelect.val(App.Models.Badge.TYPES.last());
      filters = subject.getFilters();
    });

    xit("returns the filter data as json", function() {
      expect(filters).toEqual({
        status: App.Models.Badge.STATUSES.last(),
        badgeType: App.Models.Badge.TYPES.last()
      });
    });
  });

  describe("handleSearchButtonClick", function() {
    beforeEach(function() {
      subject.render();
      subject.statusSelect.val(App.Models.Badge.STATUSES.last());
      subject.typeSelect.val(App.Models.Badge.TYPES.last());
      spyOn(subject.collection, "fetch").and.returnValue(promiseStub);
      spyOn(subject, "onBeforeFetch");
      spyOn(subject, "onAfterFetch");
      spyOn(subject, "toggleLoading");
      subject.handleSearchButtonClick(eventStub);
    });

    xit("prevents default behavior", function() {
      expect(eventStub.preventDefault).toHaveBeenCalled();
    });

    xit("sets the filters on the model", function() {
      expect(collection.filters).toEqual(subject.getFilters());
    });

    xit("calls the onBeforeFetch callback", function() {
      expect(subject.onBeforeFetch).toHaveBeenCalled();
    });

    xit("toggles loading", function() {
      expect(subject.toggleLoading).toHaveBeenCalled();
    });

    xit("fetches the collection", function() {
      expect(subject.collection.fetch).toHaveBeenCalled();
    });

    xit("handles search success when the colleciton is fetched", function() {
      expect(promiseStub.done).toHaveBeenCalledWith(subject.handleSearchSuccess);
    });
  });

  describe("handleSearchSuccess", function() {
    beforeEach(function() {
      subject.render();
      spyOn(subject, "onAfterFetch");
      spyOn(subject, "toggleLoading");
      subject.handleSearchSuccess();
    });

    xit("calls the onAfterFetch callback", function() {
      expect(subject.onAfterFetch).toHaveBeenCalled();
    });

    xit("toggles loading", function() {
      expect(subject.toggleLoading).toHaveBeenCalled();
    });
  });

  describe("events", function() {
    xit("registers handleSearchButtonClick to the search button click event", function() {
      expect(subject.events["click button.search"]).toEqual("handleSearchButtonClick");
    });
  });
});
