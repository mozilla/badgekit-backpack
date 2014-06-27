const express = require('express');
const helmet = require('helmet')
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const csrf = require('csurf');

const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.disable('x-powered-by');

app.use(helmet.csp({
  'default-src': ["'self'", 'https://login.persona.org'],
  'script-src': ["'self'", 'https://login.persona.org'],
}));
app.use(helmet.xframe('deny'));
app.use(helmet.iexss());
app.use(helmet.contentTypeOptions());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  cookieName: 'backpack::session',
  requestKey: 'session',
  secret: process.env.COOKIE_SECRET,
  duration: 30 * 24 * 60 * 60 * 1000, // 30 days
}))
app.use(csrf());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
