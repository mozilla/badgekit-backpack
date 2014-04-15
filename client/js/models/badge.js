App.Models.Badge = App.Models.BaseModel.extend({
  urlRoot: function() {
    return "/user/" + this.get("earnerId") + "/badges/" + this.id;
  }
},{
  STATUSES: ["awarded", "in queue", "reviewed"],
  TYPES: ['Community', 'Skill', 'Knowledge', 'Showcase']
});

App.Collections.Badges = App.Collections.BaseCollection.extend({
  initialize: function() {
    this.page = 1;
    this.perPage = 12;
    this.filters = {};
    this.totalCount = 0;
  },

  parse: function(attributes) {
    attributes = attributes || {};
    this.totalCount = attributes.totalCount || 0;
    return attributes.badges;
  },

  url: function() {
    return !this.userId ? undefined : this.createUrl();
  },

  createUrl: function() {
    var url = [
      "/user/",
      this.userId,
      "/badges?page=",
      this.page,
      "&perPage=",
      this.perPage
    ].join("");
    if (_.size(this.filters)) {
      url += "&" + this.filters.map(function(value, filter) { return filter + "=" + encodeURIComponent(value); }).join("&");
    }
    return url;
  }
});
