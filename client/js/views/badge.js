App.Views.Badge = App.Views.BaseView.extend({
  template: App.Templates.badge,
  className: "badge",

  render: function() {
    return this.$el.html(this.template(this.model.toJSON()));
  }
});
