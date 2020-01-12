const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
const multer  = require('multer');
const marked = require('marked');
const ejs = require('ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(helmet());

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '5eGsB9H3',
	database: 'dumblr'
});
db.connect();
global.db = db;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('view options', { rmWhitespace: true});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('ayecarumba'));
app.use(express.static(path.join(__dirname, 'public')));

marked.setOptions({
  renderer: new marked.Renderer(),
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

global.sluggify = function(str, maxlen)
{
	var out = '';
	maxlen = maxlen || str.length;
	str = String(str).toLowerCase();
	for (var i = 0; i < str.length; i++) {
		var c = str.charAt(i);
		if (c == ' ') c = '-';
		else if (c < 'a' || c > 'z') continue;
		out += c;
	}
	return out;
}

global.markdown = function(str) {
	return marked(str);
};

Date.prototype.toUnixTime = function() { return this.getTime() / 1000 | 0 };
Date.time = function() { return new Date().toUnixTime(); }

app.use('/', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//	next(createError(404));
//});

// error handler
/*
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});
*/
module.exports = app;
