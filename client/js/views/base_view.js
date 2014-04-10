App.Views.BaseView = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};
    _.bind(this.toggleLoading, this);
    this.index = options.index;
  },

  toggleLoading: function(elem) {
    var context = elem || this;
    elem = elem || context.$el;
    if (!elem.length) return;
    if (context.isLoading) {
      context.loadingMask.remove();
      context.loadingMask = undefined;
    } else {
      elem.prepend('<div class="loading-mask" />');
      context.loadingMask = this.$el.find(".loading-mask");
    }
    elem.toggleClass("loading");
    context.isLoading = context.isLoading ? false : true;
  }
});
