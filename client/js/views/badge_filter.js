App.Views.BadgeFilter = App.Views.BaseView.extend({
  template: App.Templates.badge_filter,

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  }
});
