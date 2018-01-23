var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var routes = require('./config/routes');
var constants = require('./config/constants');

var debug = require('debug');
debug.enable("rmind:*");

// Database initialization
var db = require('mongoose');
db.connect(constants.dbUrl);
// --

// App initialization
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: false,
	sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// --

module.exports = app;
