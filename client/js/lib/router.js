(function() {
  var Router = Backbone.Router.extend({
    routes: {
      "badges": "index",
      "badge/:id": "showBadge"
    },

    index: function() {
      App.Dispatcher.trigger("index");
    },

    showBadge: function(id) {
      App.Dispatcher.trigger("showBadge", id.toNumber());
    }
  });
  App.Router = new Router;
  Backbone.history.start();
})();
