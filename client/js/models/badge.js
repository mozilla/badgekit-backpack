App.Models.Badge = App.Models.BaseModel.extend({
  dateFormat: "MMMM D, YYYY",
  urlRoot: function() {
    return "/user/" + this.get("earnerId") + "/badges/" + this.id;
  },

  parse: function(attributes) {
    if (attributes.createdOn) attributes.createdOn = moment(Date.parse(attributes.createdOn));
    if (attributes.issuedOn) attributes.issuedOn = moment(Date.parse(attributes.issuedOn));
    if (attributes.expires) attributes.expires = moment(Date.parse(attributes.expires));
    return attributes;
  },

  toJSON: function() {
    var attributes = _.clone(this.attributes);
    if (attributes.createdOn) attributes.createdOn = attributes.createdOn.format(this.dateFormat);
    if (attributes.issuedOn) attributes.issuedOn = attributes.issuedOn.format(this.dateFormat);
    if (attributes.expires) attributes.expires = attributes.expires.format(this.dateFormat);
    return attributes;
  }
},{
  STATUSES: ["awarded", "in queue", "reviewed"],
  TYPES: ['Community', 'Skill', 'Knowledge', 'Showcase']
});

App.Collections.Badges = App.Collections.BaseCollection.extend({
  model: App.Models.Badge,
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
