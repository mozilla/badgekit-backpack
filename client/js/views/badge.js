App.Views.Badge = App.Views.BaseView.extend({
  template: App.Templates.badge,
  className: "badge",
  tagName: "li",

  initialize: function(options) {
    options = options || {};
    App.Views.BaseView.prototype.initialize.apply(this, arguments);
    this.user = options.user;
  },

  render: function() {
    return this.$el.html(this.template(this.badgeJSON()));
  },

  badgeJSON: function() {
    var json = this.model.toJSON();
    if (json.evidence) json.evidence = this.presentEvidence(json.evidence);
    if (this.user) json.user = this.user.toJSON();
    return json;
  },

  presentEvidence: function(evidence) {
    return {
      text: evidence.text,
      media: evidence.media.map(function(media) {
        if (media.type === "youtube") {
          return '<iframe width="325" height="206" src="' + media.url + '" frameborder="0" allowfullscreen></iframe>';
        } else {
          return '<img width="325" height="206" src="' + media.url + '" />';
        }
      })
    };
  }
});
