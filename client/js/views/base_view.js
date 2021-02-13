App.Views.BaseView = Backbone.View.extend({
  isLoading: false,
  initialize: function(options) {
    options = options || {};
    this.isLoading = this.$el.hasClass("loading");
    _.bindAll(this, "toggleLoading", "startLoading", "stopLoading", "renderLoadingMask", "removeLoadingMask");
    this.index = options.index;
  },

  toggleLoading: function() {
    if (!this.$el) return;
    this.isLoading ? this.stopLoading() : this.startLoading();
  },

  startLoading: function() {
    if (this.$el) {
      this.$el.addClass("loading");
      this.renderLoadingMask();
      this.isLoading = true;
    }
  },

  stopLoading: function() {
    if (this.$el) {
      this.$el.removeClass("loading");
      this.removeLoadingMask();
      this.isLoading = false;
    }
  },

  renderLoadingMask: function() {
    if (this.$el && !this.loadingMask) {
      this.$el.prepend('<div class="loading-mask"/>');
      this.loadingMask = this.$el.find(".loading-mask");
    }
  },

  removeLoadingMask: function() {
    if (this.$el && this.loadingMask) {
      this.loadingMask.remove();
      this.loadingMask = undefined;
    }
  }
});
