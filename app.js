var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session =require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var rent = require('./routes/rent');
var bill = require('./routes/bill');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'sdfjlkjlksdlkfjsjdl',
  resave:false,
  saveUninitialized:true,
  cookie:{secure:false}
}));

var db = require('knex')({
  client:'mysql',
  connection: {
    host:'127.0.0.1',
    port:3306,
    database:'taxi',
    user:'root',
    password:'root'
  }
});

var db2 = require('knex')({
  client:'mysql',
  connection: {
    host:'127.0.0.1',
    port:3306,
    database:'hos',
    user:'root',
    password:'root'
  },
  pool: {
      min: 0,
      max: 7,
      afterCreate: (conn, done) => {
        conn.query('SET NAMES utf8', (err) => {
          done(err, conn);
        });
      }
    },
    debug: true,
    acquireConnectionTimeout: 5000
});

app.use(function (req, res, next) {
  req.db= db;
  req.db2= db2;
  next();
});

var auth = function(req,res,next){
  var logged = req.session.logged;
  if(logged){
    next();
  }
  else{
    res.redirect('/users/login')
  }
}
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});
app.use('/rent',auth, rent); 
app.use('/bill',auth, bill);    
app.use('/users', users);
app.use('/',auth, routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});

module.exports = app;
