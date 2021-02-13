(function() {
  var _super = App.Views.BaseView.prototype;
  App.Views.CollectionView = App.Views.BaseView.extend({
    initialize: function(options) {
      _super.initialize.apply(this, arguments);
      _.bindAll(this, "createListItemView", "renderListItemView");
      this.modelViews = [];
      this.modelName = this.modelName || options.modelName;
      this.modelClass = this.modelClass || App.Models[this.modelName];
      this.modelView = this.modelView || options.modelView || App.Views[this.modelViewName()];
      this.collection = this.collection || new App.Collections[this.modelName + "s"];
      this.emptyTemplate = this.emptyTemplate || _.template('<li class="empty">There are no <%= modelName.humanize().toLowerCase() %>s</li>');
      this.collection.on("add reset remove sort", this.render, this);
    },

    render: function() {
      this.$el.empty();
      if (this.collection.isEmpty()) {
        this.$el.html(this.emptyTemplate({ modelName: this.modelName }));
      } else {
        this.createListItemViews();
        this.renderListItemViews();
      }
      return this.$el;
    },

    modelViewName: function() {
      return this.modelName + "ListItem";
    },

    createListItemView: function(model, index) {
      this.modelViews.push(new this.modelView({ model: model, index: index }));
    },

    renderListItemView: function(modelView) {
      this.$el.append(modelView.render());
    },

    createListItemViews: function() {
      this.modelViews.length = 0;
      this.collection.each(this.createListItemView);
    },

    renderListItemViews: function() {
      this.modelViews.each(this.renderListItemView);
    }
  });

})();
