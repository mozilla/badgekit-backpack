(function(global) {
  global.FakeAPI = {
    users: [
      {
        id: 1,
        user: Faker.Internet.email(),
        sharingAllowed: [true, false].sample(),
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
            createdOn: new Date(),
            jsonUrl: location.origin + "/user/1/badges/" + id,
            earnerId: 1,
            isFavorite: [true, false].sample(),
            badgeClassId: 1,
            uid: uuid.v4(),
            isNew: [true, false].sample(),
            imageUrl: location.origin + "/images/default-badge.png",
            badgeJSONUrl: location.origin + "/user/1/badges/" + id,
            evidenceUrl: location.origin + "/user/1/badges/" + id,
            issuedOn: new Date(),
            expires: new Date()
          };
        })
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
})(this);

/*
Backpack API
  id
  createdOn
  jsonUrl
  earnerId
  badgeClassId
  uid
  imageUrl
  badgeJSONUrl
  evidenceUrl
  issuedOn
  expires

Badgekit
  id
  name
  status
  description
  issuerUrl
  earnerDescription
  consumerDescription
  tags
  rubricUrl
  timeValue
  timeUnits
  limit
  multiClaimCode
  unique
  published
  imageId
  studioShape
  studioBackground
  studioTextType
  studioTextContents
  studioIcon
  studioColor
  created
  lastUpdated
  system
  issuer
  program
  badgeTyp

Badgekit API
  id
  slug
  name
  strapline
  earnerDescription
  consumerDescription
  issuerUrl
  rubricUrl
  criteriaUrl
  timeValue
  timeUnits
  limit
  unique
  created
  archived
  imageId
  systemId
  issuerId
  program
*/
