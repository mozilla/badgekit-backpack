(function() {
  FakeAPI = {
    users: [
      {
        id: 1,
        user: "user@example.com",
        badges: [
          {
            id: 1,
            createdOn: new Date(),
            jsonUrl: "http://localhost:3000/user/1/badges/1",
            earnerId: 1,
            badgeClassId: 1,
            uid: "",
            imageUrl: "http://localhost:3000/images/badge-1.jpg",
            badgeJSONUrl: "http://localhost:3000/user/1/badges/1",
            evidenceUrl: "http://localhost:3000/user/1/badges/1",
            issuedOn: new Date(),
            expires: new Date()
          }
        ]
      }
    ]
  };

  FakeServer.route("get", "/user/:id", function(id) {
    return FakeAPI.users.findWhere({ id: id });
  });

  FakeServer.route("get", "/user/:id/badges", function(id) {
    return FakeAPI.users.findWhere({ id: id }).badges;
  });

  FakeServer.route("get", "/user/:id/badges/:badgeId", function(id, badgeId) {
    return FakeAPI.users.findWhere({ id: id }).badges.findWhere({ id: badgeId });
  });
})();
