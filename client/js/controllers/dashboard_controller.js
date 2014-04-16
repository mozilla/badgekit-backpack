(App.Controllers.Dashboard = {
  initialize: function() {
    _.functions(this).each(function(func) {
      _.bindAll(App.Controllers.Dashboard, func);
    });
    App.Dispatcher.on("dashboard:index", this.initIndex);
  },

  initIndex: function(userAttributes) {
    this.cacheIndexElements();
    this.user = new App.Models.User(userAttributes);
    this.badges = this.user.get("badges");
    this.badgesView = new App.Views.Badges({ collection: this.badges });
    this.badgeDetailView = new App.Views.BadgeDetail;
    this.createBadgeFilterView();
    this.registerIndexEvents();
    this.fetchBadges();
  },

  cacheIndexElements: function() {
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
  },

  renderBadges: function() {
    this.badgeIndex.append(this.badgesView.render());
  },

  renderBadgePagination: function() {
    this.badgeIndex.append(this.badgePaginator.render());
  },

  renderBadgeFilter: function() {
    this.badgeIndex.append(this.badgeFilter.render());
  },

  renderBadgeDetail: function() {
    this.badgeShow.append(this.badgeDetailView.render());
  }
}).initialize();
