App.Models.Badge = App.Models.BaseModel.extend({
  urlRoot: function() {
    return "/user/" + this.get("earnerId") + "/badges/" + this.id;
  }
});

App.Collections.Badges = App.Collections.BaseCollection.extend({
  url: function() {
    return this.isEmpty() ? undefined : "/user/" + this.first().get("earnerId") + "/badges";
  }
});
