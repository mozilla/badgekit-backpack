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

router.post('/login', processLogin)

function showLoginPage(req, res, next) {
  res.render('login.html', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
}

function showUserIndex(req, res, next) {
  const user = req.session.user;

  client.getAllBadges(user)
    .then(function (response) {
      console.log(response);
      return res.render('user/index', {
        title: 'Welcome',
        user: user,
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
