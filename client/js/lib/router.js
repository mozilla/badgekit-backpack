(function() {
  var Router = Backbone.Router.extend({
    routes: {
      "badges": "index",
      "badge/:id": "showBadge"
    },

    index: function() {
      App.Dispatcher.trigger("index");
      console.log("index");
    },

    showBadge: function(id) {
      App.Dispatcher.trigger("showBadge", id.toNumber());
      console.log("show");
    }
  });
  App.Router = new Router;
  Backbone.history.start();
})();
