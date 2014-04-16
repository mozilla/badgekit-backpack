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
    var dateTime = [[year, month, day].join("-"), [hour, minute, seconds].join(":")].join(" ")
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
            status: ["awarded", "in queue", "reviewed"].sample(),
            description: Faker.Lorem.paragraph(),
            issuerUrl: "http://example.com",
            earnerDescription: Faker.Lorem.paragraph(),
            consumerDescription: Faker.Lorem.paragraph(),
            tags: Faker.Lorem.words(5),
            badgeType: ['Community', 'Skill', 'Knowledge', 'Showcase'].sample(),
            createdOn: fakeDate(),
            jsonUrl: location.origin + "/user/1/badges/" + id,
            earnerId: 1,
            isFavorite: [true, false].sample(),
            badgeClassId: 1,
            uid: uuid.v4(),
            isNew: [true, false].sample(),
            imageUrl: location.origin + "/images/default-badge.png",
            badgeJSONUrl: location.origin + "/user/1/badges/" + id,
            evidenceUrl: location.origin + "/user/1/badges/" + id,
            issuedOn: fakeDate(),
            expires: fakeDate()
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
    var date = params.date ? decodeURIComponent(params.date) : params.date;
    var searchParams = params.omit(["page", "perPage", "date"]);
    searchParams.each(function(value, key, params) {
      params[key] = decodeURIComponent(value);
    });
    var user = FakeAPI.users.findWhere({ id: id });
    var badges = _.size(searchParams) ? user.badges.where(searchParams) : user.badges;
    if (date) {
      badges = badges.map(function(badge) {
        var issuedOn = moment(badge.issuedOn);
        var compareDate = moment(date);
        return (issuedOn.isSame(compareDate) || issuedOn.isAfter(compareDate)) ? badge : undefined;
      }).compact();
    }
    return {
      totalCount: badges.length,
      badges: badges.slice(startAt, endAt)
    };
  });

  FakeServer.route("get", "/user/:id/badges/:badgeId", function(id, badgeId) {
    return FakeAPI.users.findWhere({ id: id }).badges.findWhere({ id: badgeId });
  });
})(this);
