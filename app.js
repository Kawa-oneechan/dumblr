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
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(helmet());

const db = mysql.createConnection({
	'host': process.env.host,
	'user': process.env.user,
	'password': process.env.password,
	'database': process.env.database
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
	return marked.parse(str);
};

global.grabRandomBackground = function() {
	var files = fs.readdirSync(path.join(__dirname, 'public/uploads'));
	files = files.filter(f => f.endsWith('.gif'));
	return files[Math.floor(Math.random() * files.length)];
}

global.getPhotosetLayout = function(count) {
	var ret = '';
	const layouts = [ '1', '11', '12', '22' ];
	while (count > 0)
	{
		var segment = 0;
		for (var i = 0; i < 3; i++)
			if (count > i) segment = i;
		ret = layouts[segment] + ret;
		count -= 4;
	}
	return ret;
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
	res.send(marked.parse(req.body['content']));
})

app.get('/testjimp/:id', function (req, res) {
	const Jimp = require('jimp');
	let s = path.join(__dirname, 'public/profiles/');
	let i = parseInt(req.params['id']);

	Jimp.read(s + i + '-150.png', (err, image) => {
		[128, 64, 32, 16].forEach(size => {
			image.resize(size, size);
			image.quality(90);
			image.writeAsync(s + i + '-' + size + '.png');
		})
		res.send({ message: 'OK!', ok: true });
	})
})

app.get('/testjimp2', function (req, res) {
	const Jimp = require('jimp');
	const base64Img = require('base64-img');

	//data URI for Kawa avatar, 32x32 version.
	let d = 'data:image/png;base64,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';
	let s = path.join(__dirname, 'uploads');
	let f = 'test';
	base64Img.img(d, s, f, (err, path) => {
		Jimp.read(path, (err, image) => {
			if (err)
				res.send(err);
			else {
				image.greyscale();
				image.writeAsync(path);
			}
		})
	})
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
