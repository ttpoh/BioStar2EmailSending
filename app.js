// アプリに関する設定を行うファイル

var createError = require('http-errors');
const express = require('express');
const session = require('express-session');

const app = express();

var path = require('path');
var baseRouter = require('./routes/base');
var mailRouter = require('./routes/mail');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: session, // Change this to a long, random string
  resave: false,
  saveUninitialized: false
}));
// ルーティング
app.use('/', baseRouter);
app.use('/mail', mailRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
