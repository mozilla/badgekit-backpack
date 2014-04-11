describe("App.Views.CollectionView", function() {
  var subject;

  beforeEach(function() {
    affix("#container");
    App.Templates["templates/some_model_list_item"] = jasmine.createSpy();
    App.Templates["templates/some_model_list_item"].render = jasmine.createSpy();
    App.Templates["templates/some_model_list"] = jasmine.createSpy();
    App.Models.SomeModel = App.Models.BaseModel.extend({});
    App.Collections.SomeModels = App.Collections.BaseCollection.extend({
      model: App.Models.SomeModel
    });
    App.Views.SomeModelList = App.Views.BaseView.extend({});
    App.Views.SomeModelListItem = App.Views.BaseView.extend({});
    subject = new App.Views.CollectionView({
      el: "#container",
      modelName: "SomeModel",
      collection: new Backbone.Collection([{ id: 1 }, { id: 2 }])
    });
  });

  it("has a modelName", function() {
    expect(subject.modelName).toEqual("SomeModel");
  });

  it("has a modelClass", function() {
    expect(subject.modelClass).toEqual(App.Models.SomeModel);
  });

  it("has modelViews", function() {
    expect(subject.modelViews).toEqual([]);
  });

  it("has a modelView", function() {
    expect(subject.modelView).toEqual(App.Views.SomeModelListItem);
  });

  it("has a collection of models", function() {
    var withDefaultCollection = new App.Views.CollectionView({
      el: "#container",
      modelName: "SomeModel"
    });
    expect(withDefaultCollection.collection).toBeTypeof(App.Collections.SomeModels);
  });

  it("has an emptyTemplate", function() {
    expect(subject.emptyTemplate).toBeDefined();
    expect(subject.emptyTemplate({ modelName: "SomeModel" })).toEqual('<li class="empty">There are no somemodels</li>');
  });

  describe("with options", function() {
    var subject;
    var OptionalCollection;
    var OptionalView;
    var SomeModel;

    beforeEach(function() {
      OptionalCollection = App.Collections.BaseCollection.extend();
      OptionalView = Backbone.View.extend();
      OptionalModel = Backbone.Model.extend();
      SomeModel = Backbone.Model.extend();

      subject = new App.Views.CollectionView({
        el: "#container",
        modelName: "SomeModel",
        modelView: OptionalView,
        collection: new OptionalCollection
      });
    });

    it("accepts a collection", function() {
      expect(subject.collection).toBeTypeof(OptionalCollection);
    });

    it("accepsts a modelView", function() {
      expect(subject.modelView).toEqual(OptionalView);
    });

    describe("subclassed properties", function() {
      var subject;
      var SubclassedView;

      beforeEach(function() {
        SubclassedView = App.Views.CollectionView.extend({
          initialize: function() {
            this.modelName = "SomeModel";
            this.modelView = OptionalView,
            this.collection = new OptionalCollection;
            this.modelClass = SomeModel;
            App.Views.CollectionView.prototype.initialize.apply(this, arguments);
          }
        });
        subject = new SubclassedView();
      });

      it("defers to the subclass modelName", function() {
        expect(subject.modelName).toEqual("SomeModel");
      });

      it("defers to the subclass modelView", function() {
        expect(subject.modelView).toEqual(OptionalView);
      });

      it("defers to the subclass collection", function() {
        expect(subject.collection).toBeTypeof(OptionalCollection);
      });

      it("defers to the subclass modelClass", function() {
        expect(subject.modelClass).toEqual(SomeModel);
      });
    });
  });

  describe("render", function() {
    beforeEach(function() {
      spyOn(subject, "render").and.callThrough();
      spyOn(subject.$el, "empty");
      subject.render();
    });

    it("empties the element", function() {
      expect(subject.$el.empty).toHaveBeenCalled();
    });

    it("returns the element", function() {
      expect(subject.render()).toEqual(subject.$el);
    });

    describe("when collection is empty", function() {
      beforeEach(function() {
        spyOn(subject.$el, "html");
        spyOn(subject, "emptyTemplate").and.callThrough();
        subject.collection.reset();
        subject.render();
      });

      it("it renders the empty template", function() {
        expect(subject.$el.html).toHaveBeenCalledWith(subject.emptyTemplate({ modelName: subject.modelName }));
      });
    });
  });

  describe("modelViewName", function() {
    it("returns a model view name string", function() {
      expect(subject.modelViewName()).toEqual("SomeModelListItem");
    });
  });

  describe("createListItemView", function() {
    beforeEach(function() {
      spyOn(subject.modelView.prototype, "initialize").and.callThrough();
      subject.createListItemView(subject.collection.first(), 0);
    });

    it("adds a view to the modelViews", function() {
      expect(subject.modelViews.length).toEqual(1);
      expect(subject.modelViews.first()).toBeTypeof(App.Views.SomeModelListItem);
      expect(subject.modelView.prototype.initialize).toHaveBeenCalledWith({ model: subject.collection.first(), index: 0});
    });
  });

  describe("renderListItemView", function() {
    beforeEach(function() {
      subject.createListItemView(subject.collection.first(), 0);
      spyOn(subject.$el, "append");
      subject.renderListItemView(subject.modelViews.first());
    });

    it("appends the rendered list item view to the element", function() {
      expect(subject.$el.append).toHaveBeenCalledWith(subject.modelViews.first().render());
    });
  });

  describe("createListItemViews", function() {
    beforeEach(function() {
      subject.createListItemViews();
    });

    it("creates a list item view for each item", function() {
      expect(subject.modelViews.length).toEqual(2);
    });

    it("clears the modelViews array", function() {
      subject.createListItemViews();
      expect(subject.modelViews.length).toEqual(2);
    });
  });

  describe("renderListItemViews", function() {
    beforeEach(function() {
      subject.createListItemViews();
      spyOn(subject, "renderListItemView");
      subject.renderListItemViews();
    });

    it("renders each list item view", function() {
      expect(subject.renderListItemView.calls.count()).toEqual(2);
    });
  });

});
