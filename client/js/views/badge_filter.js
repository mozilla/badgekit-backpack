App.Views.BadgeFilter = App.Views.BaseView.extend({
  template: App.Templates.badge_filter,
  events: {
    "click button.search": "handleSearchButtonClick"
  },

  initialize: function(options) {
    options = options || {};
    _.bindAll(this, "handleSearchSuccess");
    this.onBeforeFetch = options.onBeforeFetch || $.noop;
    this.onAfterFetch = options.onAfterFetch || $.noop;
    this.render();
    this.cacheElements();
    this.initializeDatepicker();
  },

  render: function() {
    this.$el.html(this.template({
      statuses: App.Models.Badge.STATUSES,
      types: App.Models.Badge.TYPES
    }));
  },

  cacheElements: function() {
    this.statusSelect = $("#filter-badge-status-select");
    this.typeSelect = $("#filter-badge-type-select");
    this.categorySelect = $("#filter-badge-category-select");
    this.dateField = $("#filter-badge-date-field");
  },

  initializeDatepicker: function() {
    this.dateField.datepicker();
  },

  handleSearchButtonClick: function(e) {
    e.preventDefault();
    App.Dispatcher.trigger("badgesFiltered");
    this.toggleLoading();
    this.collection.filters = this.getFilters();
    this.onBeforeFetch();
    this.collection.fetch()
      .done(this.handleSearchSuccess);
  },

  handleSearchSuccess: function() {
    this.toggleLoading();
    this.onAfterFetch();
    if (!_.size(this.getFilters())) App.Dispatcher.trigger("badgePaginator:resetCount");
  },

  getFilters: function() {
    var filters = {};
    if (this.statusSelect.val()) filters.status = this.statusSelect.val();
    if (this.typeSelect.val()) filters.badgeType = this.typeSelect.val();
    if (this.categorySelect.val()) filters.category = this.categorySelect.val();
    if (this.dateField.val()) filters.date = this.dateField.val();
    return filters;
  }
});
