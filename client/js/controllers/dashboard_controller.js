(App.Controllers.Dashboard = {
  initialize: function() {
    _.functions(this).each(function(func) {
      _.bindAll(App.Controllers.Dashboard, func);
    });
    App.Dispatcher.on("dashboard:index", this.initIndex);
  },

  initIndex: function(userAttributes) {
    if (!this.initialized) {
      this.cacheIndexElements();
      this.user = new App.Models.User(userAttributes);
      this.badges = this.user.get("badges");
      this.badgesView = new App.Views.Badges({ collection: this.badges });
      this.badgeDetailView = new App.Views.BadgeDetail({
        user: this.user
      });
      this.registerIndexEvents();
      this.fetchBadges();
      this.initialized = true;
    } else {
      this.handleIndex();
    }
  },

  cacheIndexElements: function() {
    this.badgesContainer = $("#badges-container");
    this.badgeContainer = $("#badge-container");
    this.badgeIndex = $("#badge-index");
    this.badgeShow = $("#badge-show");
  },

  fetchBadges: function() {
    if (this.badges.isEmpty()) {
      this.badges.fetch()
        .fail(this.handleBadgeFetchFailure)
        .done(this.handleBadgesFetchSuccess);
    }
  },

  registerIndexEvents: function() {
    App.Dispatcher.on("showBadge", this.handleShowBadge, this);
    App.Dispatcher.on("index", this.handleIndex, this);
  },

  handleBadgesFetchSuccess: function() {
    this.renderBadges();
    this.createPaginationView();
    var url = location.hash.split("/").rest();
    if (url.first() === "badge") {
      App.Dispatcher.trigger("showBadge", url.last().toNumber());
    }
  },

  handleBadgeFetchFailure: function(response) {
    this.badgesView.$el.html("<li>There was an error fetching your badges</li>");
  },

  handleIndex: function() {
    this.badgeShow.hide();
    this.badgeIndex.show();
  },

  handleShowBadge: function(id) {
    this.badgeIndex.hide();
    this.badgeShow.show();
    this.badgeDetailView.model = this.badges.findWhere({ id: id });
    this.renderBadgeDetail();
  },

  createPaginationView: function() {
    this.badgePaginator = new App.Views.Paginator({
      collection: this.badges,
      onBeforeFetch: this.badgesView.toggleLoading,
      onAfterFetch: this.badgesView.toggleLoading
    });
    this.renderBadgePagination();
  },

  createBadgeFilterView: function() {
    this.badgeFilter = new App.Views.BadgeFilter({
      collection: this.badges,
      onBeforeFetch: this.badgesView.toggleLoading,
      onAfterFetch: this.badgesView.toggleLoading
    });
    this.renderBadgeFilter();
    this.badgeFilter.cacheElements();
    this.badgeFilter.initializeDatepicker();
  },

  renderBadges: function() {
    this.badgesContainer.append(this.badgesView.render());
  },

  renderBadgePagination: function() {
    this.badgesContainer.append(this.badgePaginator.render());
  },

  renderBadgeFilter: function() {
    this.badgesContainer.append(this.badgeFilter.render());
  },

  renderBadgeDetail: function() {
    this.badgeContainer.append(this.badgeDetailView.render());
  }
}).initialize();
