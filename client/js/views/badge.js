App.Views.Badge = App.Views.BaseView.extend({
  template: App.Templates.badge,
  className: "badge",
  tagName: "li",
  descriptionLength: 50,

  render: function() {
    return this.$el.html(this.template(this.badgeJSON()));
  },

  badgeJSON: function() {
    var json = this.model.toJSON();
    json.description = json.description.truncate(this.descriptionLength);
    json.statusClass = this.statusClass();
    json.ribbonText = this.ribbonText();
    return json;
  },

  statusClass: function() {
    return this.model.get("isFavorite") ? "favorite" : this.model.get("status").hyphenate();
  },

  ribbonText: function() {
    return this.model.get("isFavorite") ? "Favorite" : this.model.get("status").titleize();
  }
});
