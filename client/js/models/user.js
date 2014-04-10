App.Models.User = App.Models.BaseModel.extend({
  urlRoot: "/user",
  relationships: {
    badges: App.Collections.Badges
  }
});
