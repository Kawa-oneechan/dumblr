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
const Entities = require('html-entities').XmlEntities;
var crypto = require('crypto');
const secret = 'You thought it was a salt, but it was me, Dio!';

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
global.entities = new Entities();

global.user = {
	'id': 0,
	'parent-id': 0,
	'handle': '',
	'title': 'Guest',
	'password-hash': '*',
	'dash-color': '',
	'personal-color': '',
	'all-nsfw': 0,
	'show-nsfw': 0,
	'otherBlogs': {}
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('view options', { rmWhitespace: true});

app.use('/stylesheets', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/stylesheets', express.static(__dirname + '/node_modules/bootstrap-tokenfield/dist/css'));
app.use('/stylesheets', express.static(__dirname + '/node_modules/bootstrap-markdown-editor-4/dist/css'));
app.use('/stylesheets/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/css'));
app.use('/javascripts', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/javascripts', express.static(__dirname + '/node_modules/popper.js/dist/umd'));
app.use('/javascripts', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/javascripts', express.static(__dirname + '/node_modules/bootstrap-tokenfield/dist'));
app.use('/javascripts', express.static(__dirname + '/node_modules/bootstrap-markdown-editor-4/dist/js'));
app.use('/javascripts', express.static(__dirname + '/node_modules/ace-builds/src-min'));
app.use('/javascripts', express.static(__dirname + '/node_modules/twemoji/dist'));
app.use('/stylesheets/webfonts', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/webfonts'));

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
		else if ((/[^a-zA-Z0-9]/.test(c))) continue;
		out += c;
	}
	return out;
}

global.markdown = function(str) {
	return marked(str);
};

Date.prototype.toUnixTime = function() { return this.getTime() / 1000 | 0 };
Date.time = function() { return new Date().toUnixTime(); }

global.notUsers = [ 'dashboard', 'tags', 'login', 'logout' ];

app.get('/logout', function (req, res) {
	res.clearCookie('dumblr_id');
	res.clearCookie('dumblr_password');
	res.redirect('/');
});

app.post('/login', function (req, res) {
	const hash = crypto.createHmac('sha256', secret).update(req.body['password']).digest('hex');
	console.log("trying to log in as '"+req.body['username']+"' with hash '"+hash+"'");
	db.query("SELECT id FROM users WHERE handle=? AND `password-hash`=?", [req.body['username'], hash], function (error, results, fields) {
		if (results.length) {
			res.cookie('dumblr_id', results[0]['id']);
			res.cookie('dumblr_password', hash);
			res.redirect('/');
		} else {
			res.render('login', { message: 'Invalid user name or password.' });
		}
	});
});

app.use('/', usersRouter);
app.use(function(req, res, next) {
	console.log('Login check!');
	if (req.cookies['dumblr_id'] && req.cookies['dumblr_password']) {
		db.query("SELECT * FROM `users` WHERE (id=? AND `password-hash`=?) OR (`parent-id`=?) ORDER BY id", [req.cookies['dumblr_id'], req.cookies['dumblr_password'], req.cookies['dumblr_id']], function (error, results, fields) {
			if (results.length) {
				req.user = results.shift();
				if (req.user.dashColor)
					req.user.dashColor = '#' + req.user.dashColor;
				req.user.otherBlogs = results;
				console.log(req.user);

				next();
			}
			else {
				res.render('login', { message: 'Invalid login state.' });
			}

		})
	}
	else {
		res.render('login', { message: 'Log in to see the Dumblr Tashboard.' });
	}
});
app.use('/', indexRouter);

app.post('/rendermarkdown', function (req, res) {
	res.send(marked(req.body['content']));
})

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
