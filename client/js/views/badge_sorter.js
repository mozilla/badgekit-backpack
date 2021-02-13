App.Views.BadgeSorter = App.Views.BaseView.extend({
  template: App.Templates.badge_sorter,
  events: {
    "change select": "handleSelectChange"
  },

  initialize: function() {
    this.render();
    this.selector = this.$el.find("select");
  },

  render: function() {
    this.$el.html(this.template());
  },

  handleSelectChange: function() {
    this.collection.filters["sort"] = this.selector.val();
    this.collection.fetch();
  }
});
