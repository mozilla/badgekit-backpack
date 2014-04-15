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
    this.user.get("badges").totalCount = this.user.get("badgeCount");
    this.myBadges.addClass("loading");
    this.fetchBadges();
  },

  fetchBadges: function() {
    this.user.get("badges").fetch()
      .fail(this.handleBadgeFetchFailure)
      .done(this.handleBadgesFetchSuccess);
  },

  handleBadgesFetchSuccess: function() {
    this.myBadges.removeClass("loading");
    this.renderBadges();
    this.badgePaginator = new App.Views.Paginator({
      el: "#badges-pagination",
      collection: this.user.get("badges"),
      onBeforeFetch: this.badgesView.toggleLoading,
      onAfterFetch: this.badgesView.toggleLoading
    });

    this.badgeFilter = new App.Views.BadgeFilter({
      el: "#badge-filter",
      collection: this.user.get("badges"),
      onBeforeFetch: this.badgesView.toggleLoading,
      onAfterFetch: this.badgesView.toggleLoading
    });
  },

  cacheIndexElements: function() {
    this.myBadges = $("#my-badges");
  },

  renderBadges: function() {
    this.badgesView = new App.Views.Badges({
      collection: this.user.get("badges"),
      el: this.myBadges
    });
    this.badgesView.render();
  },

  handleBadgeFetchFailure: function(response) {
    this.myBadges.html("<li>There was an error fetching your badges</li>");
  }
}).initialize();
