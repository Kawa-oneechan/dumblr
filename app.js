const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Sqrl = require('squirrelly');
const mysql = require('mysql');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const marked = require('marked');
const crypto = require('crypto');
const secret = 'You thought it was a salt, but it was me, Dio!';

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(helmet());

app.locals.connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '5eGsB9H3',
	database: 'dumblr'
});

app.locals.connection.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'squirrelly');

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

function sluggify(str, maxlen)
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

Sqrl.defineFilter('markdown', function(str) {
	return marked(str);
});

Sqrl.defineFilter('slug', function(str) { return sluggify(str); });

Date.prototype.toUnixTime = function() { return this.getTime() / 1000 | 0 };
Date.time = function() { return new Date().toUnixTime(); }

Sqrl.definePartial('top', Sqrl.renderFile('./views/top.squirrelly', { }));
Sqrl.definePartial('bottom', Sqrl.renderFile('./views/bottom.squirrelly', { }));
Sqrl.definePartial('postnewtoolbar', Sqrl.renderFile('./views/post-new-toolbar.squirrelly', { }));

Sqrl.defineHelper('postloop', function(args, content, blocks) {
	return Sqrl.renderFile('./views/post-loop.squirrelly', args);
});

app.route('/')
	.get(function(req, res, next) {
		if (req.cookies['dumblr_id'] && req.cookies['dumblr_password']) {
			app.locals.connection.query("SELECT id FROM users WHERE id=? AND `password-hash`=?", [req.cookies['dumblr_id'], req.cookies['dumblr_password']], function (error, results, fields) {

				if (results.length) {
					var my_id = results[0]['id'];

					app.locals.connection.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN follows ON posts.user=follows.target LEFT JOIN users ON users.id=posts.user WHERE follows.follower=? ORDER BY timestamp DESC", [my_id], function (error, results, fields) {
						if (error) throw error;
						res.render('posts', { posts: results });
					});
				}
				else {
					res.render('login', { message: 'Invalid login state.' });
				}

			})
		}
		else {
			res.render('login', { message: 'Log in to see the Dumblr Tashboard.' });
		}
	})
	.post(upload.any(), function(req, res, next) {
		console.log("POST /");
		if (req.cookies['dumblr_id'] && req.cookies['dumblr_password']) {
			app.locals.connection.query("SELECT id FROM users WHERE id=? AND `password-hash`=?", [req.cookies['dumblr_id'], req.cookies['dumblr_password']], function (error, results, fields) {

				if (results.length) {
					var my_id = results[0]['id'];

					if (req.body['post-type'] == 'text')
					{
						var timestamp = Date.time()
						app.locals.connection.query("INSERT INTO posts SET ?", {
							'id': timestamp,
							'user': my_id,
							'type': 'text',
							'body-text': req.body['body-text'],
							'title': req.body['title'],
							'slug': sluggify(req.body['body-text'], 64),
							'tags': '',
							'timestamp': timestamp
						}, function(error, results, fields) {
							if (error) throw error;
							app.locals.connection.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN follows ON posts.user=follows.target LEFT JOIN users ON users.id=posts.user WHERE posts.id = ?", [timestamp], function (error, results, fields) {
								if (error) throw error;
								res.render('post-loop', { posts: results });
							});
						});
					}

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

app.post('/login', function (req, res) {
	const hash = crypto.createHmac('sha256', secret).update(req.body['password']).digest('hex');
	console.log("trying to log in as '"+req.body['username']+"' with hash '"+hash+"'");
	app.locals.connection.query("SELECT id FROM users WHERE handle=? AND `password-hash`=?", [req.body['username'], hash], function (error, results, fields) {
		if (results.length) {
			res.cookie('dumblr_id', results[0]['id']);
			res.cookie('dumblr_password', hash);
			res.redirect('/');
		} else {
			res.render('login', { message: 'Invalid user name or password.' });
		}
	});
});

app.route('/:user/:post')
	.get(function(req, res, next) {
		req.params['post'] = parseInt(req.params['post']);
		app.locals.connection.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.user WHERE users.handle=? AND posts.id=?", [req.params['user'], req.params['post']], function (error, results, fields) {
			if (error) throw error;
			if (results.length)
				res.render('posts', { posts: results });
			else
			{
				res.locals.message = 'No such post.';
				res.render('posts-error');
			}
		});
	});

app.route('/:user')
	.get(function(req, res, next) {
		app.locals.connection.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.user WHERE users.handle=? ORDER BY timestamp DESC", [req.params['user']], function (error, results, fields) {
			if (error) throw error;
			if (results.length)
				res.render('posts', { posts: results });
			else
				res.render('posts-error', { message: 'Nothing here~' });
		});
	});

//app.use('/users', usersRouter);

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
