
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./models/user');
var http = require('http');
var path = require('path');
var partials = require('express-partials');
var MongoStore = require('connect-mongo')(express);
var settings = require('./Settings');
var flash = require('connect-flash');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  cookie: { maxAge :60000 *20 },
  store: new MongoStore({
    db:settings.db
  })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

app.use(function (req, res, next) {
res.locals.error = req.flash('error');
res.locals.success = req.flash('success');
res.locals.user = req.session.user;
next();
});
/*
app.dynamicHelpers({
  user: function(req, res) {
  return req.session.user;
  },
  error: function(req, res) {
    var err = req.flash('error');
    if (err.length) return err;
    else
  return null;
  },
  success: function(req, res) {
  var succ = req.flash('success');
  if (succ.length)
  return succ;
else
  return null; 3 },
});
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
