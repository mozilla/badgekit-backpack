const ApiClient = require('../lib/api-client');
const express = require('express');
const verifyPersona = require('../lib/persona');
const router = express.Router();

const client = new ApiClient();

router.get('/', function(req, res, next) {
  if (!req.session.user)
    return showLoginPage.apply(null, arguments);

  return showUserIndex.apply(null, arguments);
});

router.post('/login', processLogin);
router.get('/badges/:badgeId', showOneBadge);
router.delete('/badges/:badgeId', deleteBadge);

function showLoginPage(req, res, next) {
  res.render('login.html', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
}

function showUserIndex(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/');

  const user = req.session.user;
  console.log(user);

  client.getAllBadges({user: user})
    .then(function (response) {
      const badges = response;
      return res.render('user/index', {
        title: 'Welcome',
        user: user,
        badges: badges,
      });
    })

    .catch(function (error) {
      console.error(error);
      return next(new Error('Error communicating with the backpack API'));
    })

}

function deleteBadge(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/');

  const user = req.session.user;
  const badgeId = req.params.badgeId;
  client.deleteBadge({ user: user, badgeId: badgeId })
    .then(function (result) {
      return res.redirect(303, '/')
    })

    .catch(function (error) {
      if (error.statusCode === 404)
        return res.send(404, 'Badge Not Found');

      console.error(error);
      return next(new Error('Error communicating with the backpack API'));
    })
}

function showOneBadge(req, res, next) {
  if (!req.session.user)
    return res.redirect(303, '/');

  const user = req.session.user;
  const badgeId = req.params.badgeId;
  client.getOneBadge({ user: user, badgeId: badgeId })
    .then(function (badge) {
      return res.render('user/badge', {
        title: badge.badgeClass.name,
        user: user,
        badge: badge,
        csrfToken: req.csrfToken(),
      });
    })

    .catch(function (error) {
      console.error(error);
      return next(new Error('Error communicating with the backpack API'));
    })
}

function processLogin(req, res, next) {
  const assertion = req.body.assertion;
  console.log(assertion);
  verifyPersona(assertion)
    .then(function (email) {
      req.session.user = email;
      return res.redirect(303, '/');
    })
    .catch(function (error) {
      return next(error)
    })

}

module.exports = router;
