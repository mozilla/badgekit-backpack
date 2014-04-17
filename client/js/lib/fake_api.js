(function(global) {
  function fakeDate() {
    var year = ["2012", "2013", "2014"].sample();
    var month = _.range(1, 13).map(function(i) { return "" + i; }).sample().replace(/^(\d{1})$/, "0$1");
    var day = _.range(1, 32).map(function(i) { return "" + i; }).sample().replace(/^(\d{1})$/, "0$1");
    var hour = _.range(1, 24).map(function(i) { return "" + i; }).sample().replace(/^(\d{1})$/, "0$1");
    var minute = _.range(1, 61).map(function(i) { return "" + i; }).sample().replace(/^(\d{1})$/, "0$1");
    var seconds = _.range(1, 61).map(function(i) { return "" + i; }).sample().replace(/^(\d{1})$/, "0$1");

    var generatedMonth = month.toNumber();
    var generatedDay = day.toNumber();
    var today = moment().format("D").toNumber();
    var thisMonth = moment().format("M").toNumber();

    if (year === moment().format("YYYY") && generatedMonth >= thisMonth) {
      if (generatedMonth > thisMonth) month = ("" + thisMonth).replace(/^(\d{1})$/, "0$1");
      if (generatedDay > today) day = ("" + today).replace(/^(\d{1})$/, "0$1");
    }
    var dateTime = [[year, month, day].join("-"), [hour, minute, seconds].join(":")].join(" ");
    return dateTime;
  }

  global.FakeAPI = {
    users: [
      {
        id: 1,
        user: Faker.Internet.email(),
        sharingAllowed: true,
        badges: _.times(50, function(i) {
          var id = i + 1;
          return {
            id: id,
            name: Faker.Company.bs(),
            description: Faker.Lorem.paragraph().capitalize() + ".",
            issuerUrl: "http://example.com",
            createdOn: fakeDate(),
            earnerId: 1,
            imageUrl: location.origin + "/images/default-badge.png",
            evidenceUrl: "http://example.com",
            issuedOn: fakeDate(),
            expires: fakeDate(),
            evidence: {
              text: Faker.Lorem.paragraph().capitalize() + ".",
              media: _.times(_.random(1, 3), function() {
                var type = ["youtube", "image"].sample();
                var evidenceMap = {
                  youtube: ["//www.youtube.com/embed/dQw4w9WgXcQ", "//www.youtube.com/embed/ScMzIvxBSi4"].sample(),
                  image: "//placehold.it/325x206"
                };
                return {
                  type: type,
                  url: evidenceMap[type]
                };
              })
            }
          };
        })
      }
    ]
  };

  FakeServer.route("get", "/user/:id", function(id) {
    return FakeAPI.users.findWhere({ id: id });
  });

  FakeServer.route("get", "/user/:id/badges", function(id, params) {
    var page = params.page.toNumber();
    var perPage = params.perPage.toNumber();
    var startAt = (perPage * page) - perPage;
    var endAt = startAt + perPage;
    var user = FakeAPI.users.findWhere({ id: id });

    return {
      totalCount: user.badges.length,
      badges: user.badges.slice(startAt, endAt)
    };
  });

  FakeServer.route("get", "/user/:id/badges/:badgeId", function(id, badgeId) {
    return FakeAPI.users.findWhere({ id: id }).badges.findWhere({ id: badgeId });
  });

  FakeServer.route("get", "/foo", { foo: "bar" });
})(this);
