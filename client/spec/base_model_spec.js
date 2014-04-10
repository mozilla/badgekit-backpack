describe("App.Models.BaseModel", function() {
  var BaseModel;
  var ChildModel;
  var data;
  var subject;

  beforeEach(function() {
    ChildModel = App.Models.BaseModel.extend();
    BaseModel = App.Models.BaseModel.extend({
      wrappedAttributes: {
        first_child: ChildModel,
        second_child: ChildModel
      }
    });
    data = { first_child: { id: 1 }};
    subject = new BaseModel;
  });

  describe("wrapAttribute", function() {
    it("wraps the given attribute", function() {
      subject.wrapAttribute(data, "first_child", ChildModel);
      expect(data.first_child).toBeTypeof(ChildModel);
    });
  });

  describe("parse", function() {
    it("wraps the given attributes", function() {
      spyOn(subject, "wrapAttribute").and.callThrough();
      subject.parse(data);
      expect(subject.wrapAttribute).toHaveBeenCalled();
      expect(data.first_child).toBeTypeof(ChildModel);
    });
  });

  describe("isPersisted", function() {
    it("returns the opposite of isNew", function() {
      expect(subject.isPersisted()).toBeFalse();
      spyOn(subject, "isNew").and.returnValue(false);
      expect(subject.isPersisted()).toBeTrue();
    });
  });
});
