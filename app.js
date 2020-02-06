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
const fs = require('fs');
const crypto = require('crypto');
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('view options', { rmWhitespace: true});

app.use('/stylesheets', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/stylesheets', express.static(path.join(__dirname, 'node_modules/bootstrap-tokenfield/dist/css')));
app.use('/stylesheets', express.static(path.join(__dirname, 'node_modules/bootstrap-markdown-editor-4/dist/css')));
app.use('/stylesheets/fontawesome', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/css')));
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/bootstrap-tokenfield/dist')));
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/bootstrap-markdown-editor-4/dist/js')));
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/ace-builds/src-min')));
app.use('/javascripts', express.static(path.join(__dirname, 'node_modules/twemoji/dist')));
app.use('/stylesheets/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts')));

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

global.grabRandomBackground = function() {
	var files = fs.readdirSync(path.join(__dirname, 'public/uploads'));
	files = files.filter(f => f.endsWith('.gif'));
	return files[Math.floor(Math.random() * files.length)];
}

Date.prototype.toUnixTime = function() { return this.getTime() / 1000 | 0 };
Date.time = function() { return new Date().toUnixTime(); }

app.get('/logout', function (req, res, next) {
	res.clearCookie('dumblr_id');
	res.clearCookie('dumblr_password');
	res.redirect('/');
});

app.post('/login', function (req, res, next) {
	const hash = crypto.createHmac('sha256', secret).update(req.body['password']).digest('hex');
	console.log("trying to log in as '"+req.body['username']+"' with hash '"+hash+"'");
	db.query("SELECT id FROM users WHERE handle=? AND `password-hash`=?", [req.body['username'], hash], function (error, results, fields) {
		console.log(results);
		if (results.length) {
			res.cookie('dumblr_id', results[0]['id']);
			res.cookie('dumblr_password', hash);
			res.redirect('/');
		} else {
			res.render('login', { message: 'Invalid user name or password.', rndBack: global.grabRandomBackground() });
		}
	});
});

app.use('/', indexRouter);
app.use('/', usersRouter);

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
