App.Models.Badge = App.Models.BaseModel.extend({
  urlRoot: function() {
    return "/user/" + this.get("earnerId") + "/badges/" + this.id;
  }
});

App.Collections.Badges = App.Collections.BaseCollection.extend({
  initialize: function() {
    this.page = 1;
    this.perPage = 12;
  },

  url: function() {
    return !this.userId ? undefined : "/user/" + this.userId + "/badges?page=" + this.page + "&perPage=" + this.perPage;
  }
});
