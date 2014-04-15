App.Models.User = App.Models.BaseModel.extend({
  urlRoot: "/user",
  relationships: {
    badges: App.Collections.Badges
  },

  initialize: function() {
    if (!this.get("badges")) {
      this.set("badges", new App.Collections.Badges);
      this.get("badges").userId = this.id;
    }
  }
});
