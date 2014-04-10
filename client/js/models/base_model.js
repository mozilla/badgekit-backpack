App.Models.BaseModel = Backbone.Model.extend({
  constructor: function(attributes, options) {
    options = options || {};
    options.parse = true;
    Backbone.Model.call(this, attributes, options);
  },

  wrapAttribute: function(attributes, key, Class) {
    var value = attributes[key];
    if (attributes[key] && !isTypeof(Class, value)) {
      attributes[key] = new Class(value);
    }
  },

  parse: function(data) {
    var _this = this;
    if (this.relationships) {
      _(this.relationships).each(function(Class, attr) {
        _this.wrapAttribute(data, attr, Class);
      });
    }
    return data;
  },

  isPersisted: function() {
    return !this.isNew();
  }
});
