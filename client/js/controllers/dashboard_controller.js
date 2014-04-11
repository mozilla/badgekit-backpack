(App.Controllers.Dashboard = {
  initialize: function() {
    _.functions(this).each(function(func) {
      _.bindAll(App.Controllers.Dashboard, func);
    });
    App.Dispatcher.on("dashboard:index", this.initIndex);
  },

  initIndex: function(userAttributes) {
    this.cacheIndexElements();
    App.CurrentUser = new App.Models.User(userAttributes);
    App.CurrentUser.fetch()
      .fail(this.renderBadgeFetchFailure)
      .done(this.renderBadges);
  },

  cacheIndexElements: function() {
    this.myBadges = $("#my-badges");
  },

  renderBadges: function() {
    this.badgesView = new App.Views.Badges({
      collection: App.CurrentUser.get("badges"),
      el: this.myBadges
    });
    this.badgesView.render();
  },

  renderBadgeFetchFailure: function(response) {
    console.log(response);
    this.myBadges.html("<li>There was an error fetching your badges</li>");
  }
}).initialize();
