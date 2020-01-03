var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var crypto = require('crypto');
const secret = 'You thought it was a salt, but it was me, Dio!';

router.get('/', function(req, res, next) {
	if (req.cookies['dumblr_id'] && req.cookies['dumblr_password']) {
		req.app.locals.connection.query("SELECT id FROM users WHERE id=? AND `password-hash`=?", [req.cookies['dumblr_id'], req.cookies['dumblr_password']], function (error, results, fields) {

			if (results.length) {
				var my_id = results[0]['id'];

				req.app.locals.connection.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN follows ON posts.`user-id`=follows.target LEFT JOIN users ON users.id=posts.`user-id` WHERE follows.follower=? ORDER BY `posted-on` DESC", [my_id], function (error, results, fields) {
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
});

router.post('/', upload.any(), function(req, res, next) {
	console.log("POST /");
	if (req.cookies['dumblr_id'] && req.cookies['dumblr_password']) {
		req.app.locals.connection.query("SELECT id FROM users WHERE id=? AND `password-hash`=?", [req.cookies['dumblr_id'], req.cookies['dumblr_password']], function (error, results, fields) {

			if (results.length) {
				var my_id = results[0]['id'];

				if (req.body['post-type'] == 'text')
				{
					var timestamp = Date.time()
					req.app.locals.connection.query("INSERT INTO posts SET ?", {
						'id': timestamp,
						'user-id': my_id,
						'post-type': 'text',
						'body-text': req.body['body-text'],
						'title': req.body['title'],
						'slug': req.app.locals.sluggify(req.body['body-text'], 64),
						'tags': '',
						'posted-on': timestamp
					}, function(error, results, fields) {
						if (error) throw error;
						req.app.locals.connection.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN follows ON posts.`user-id`=follows.target LEFT JOIN users ON users.id=`posts.user-id` WHERE posts.id = ?", [timestamp], function (error, results, fields) {
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

router.get('/logout', function (req, res) {
	res.clearCookie('dumblr_id');
	res.clearCookie('dumblr_password');
	res.redirect('/');
});

router.post('/login', function (req, res) {
	const hash = crypto.createHmac('sha256', secret).update(req.body['password']).digest('hex');
	console.log("trying to log in as '"+req.body['username']+"' with hash '"+hash+"'");
	req.app.locals.connection.query("SELECT id FROM users WHERE handle=? AND `password-hash`=?", [req.body['username'], hash], function (error, results, fields) {
		if (results.length) {
			res.cookie('dumblr_id', results[0]['id']);
			res.cookie('dumblr_password', hash);
			res.redirect('/');
		} else {
			res.render('login', { message: 'Invalid user name or password.' });
		}
	});
});

module.exports = router;
