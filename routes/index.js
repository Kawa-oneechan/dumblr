var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var crypto = require('crypto');
const secret = 'You thought it was a salt, but it was me, Dio!';

router.get('/', function(req, res, next) {
	if (req.cookies['dumblr_id'] && req.cookies['dumblr_password']) {
		db.query("SELECT id, `dash-color` FROM users WHERE id=? AND `password-hash`=?", [req.cookies['dumblr_id'], req.cookies['dumblr_password']], function (error, results, fields) {

			if (results.length) {
				global.dashColor = '#' + results[0]['dash-color'];
				var my_id = results[0]['id'];

				db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN follows ON posts.`user-id`=follows.target LEFT JOIN users ON users.id=posts.`user-id` WHERE follows.follower=? ORDER BY `posted-on` DESC", [my_id], function (error, results, fields) {
					if (error) throw error;
					if (results.length) {
						res.render('posts', { posts: results, newPost: true, message: '' });
					}
					else {
						res.render('posts-error', { message: 'No posts?' });
					}
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
		db.query("SELECT id FROM users WHERE id=? AND `password-hash`=?", [req.cookies['dumblr_id'], req.cookies['dumblr_password']], function (error, results, fields) {

			if (results.length) {
				var my_id = results[0]['id'];

				if (req.body['post-type'] == 'text')
				{
					const stringTags = req.body['tags'].length > 2 ? JSON.stringify(req.body['tags'].split(', ').map(t => [t, sluggify(t)])) : '';
					//console.log('tags: "' + stringTags + '"');
					var timestamp = Date.time()
					db.query("INSERT INTO posts SET ?", {
						'id': timestamp,
						'user-id': my_id,
						'post-type': 'text',
						'body-text': req.body['body-text'],
						'title': req.body['title'],
						'photos': '',
						'question': '',
						'reblog-data': '',
						'reblog-count': 0,
						'slug': sluggify(req.body['body-text'], 64),
						'tags': stringTags,
						'nsfw': 0,
						'flagged': 0,
						'posted-on': timestamp
					}, function(error, results, fields) {
						if (error) throw error;
						db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN follows ON posts.`user-id`=follows.target LEFT JOIN users ON users.id=posts.`user-id` WHERE posts.id = ?", [timestamp], function (error, results, fields) {
							if (error) throw error;
							res.render('partials/post-loop', { posts: results, newPost: false, message: '' });
						});
					});
					//res.send("lol");
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

router.get('/tags/:tag', function(req, res, next) {
	if (req.cookies['dumblr_id'] && req.cookies['dumblr_password']) {
		db.query("SELECT id FROM users WHERE id=? AND `password-hash`=?", [req.cookies['dumblr_id'], req.cookies['dumblr_password']], function (error, results, fields) {

			if (results.length) {
				var my_id = results[0]['id'];

				db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE tags LIKE ? ORDER BY `posted-on` DESC", ['%"'+req.params['tag']+'"%'], function (error, results, fields) {
					if (error) throw error;
					if (results.length) {
						res.render('posts', { posts: results, newPost: false, message: 'Showing posts with tag \'' + req.params['tag'] + '\'' });
					}
					else {
						res.render('posts-error', { message: 'No results for this tag.' });
					}
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

router.get('/logout', function (req, res) {
	res.clearCookie('dumblr_id');
	res.clearCookie('dumblr_password');
	res.redirect('/');
});

router.post('/login', function (req, res) {
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

module.exports = router;
