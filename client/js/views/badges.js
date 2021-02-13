(function() {
  var _super = App.Views.CollectionView.prototype;
  App.Views.Badges = App.Views.CollectionView.extend({
    modelName: "Badge",
    className: "badges",
    id: "my-badges",
    tagName: "ul",
    modelView: App.Views.Badge,
    groupsOf: 4,

    renderListItemView: function(modelView) {
      _super.renderListItemView.apply(this, arguments);
      this.renderListItemViewGrouped(modelView);
    },

    renderListItemViewGrouped: function(modelView) {
      if (this.lastInGroup(modelView)) {
        this.markLastInGroup(modelView);
        this.renderDivider();
      }
    },

    lastInGroup: function(view) {
      return (view.index + 1) % 4 === 0;
    },

    markLastInGroup: function(view) {
      view.$el.addClass("omega");
    },

    renderDivider: function() {
      this.$el.append('<li class="divider"/>');
    }
  });
})();
