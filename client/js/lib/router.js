(function() {
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "badge/:id": "showBadge"
    },

    index: function() {
      console.log("index");
      App.Dispatcher.trigger("index");
    },

    showBadge: function(id) {
      console.log("showBadge");
      App.Dispatcher.trigger("showBadge", id.toNumber());
    }
  });
  App.Router = new Router;
  Backbone.history.start();
})();
