var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var mylogin = require('../login.js')
const { v1: uuidv1 } = require('uuid');

router.get('/', mylogin({allowGuest:false}), function(req, res, next) {
	db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN follows ON posts.`user-id`=follows.target LEFT JOIN users ON users.id=posts.`user-id` WHERE follows.follower=? ORDER BY `posted-on` DESC", [req.user.id], function (error, results, fields) {
		if (error) throw error;
		if (results.length) {
			res.render('posts', { posts: results, newPost: true, user: req.user, message: '' });
		}
		else {
			res.render('posts-error', { user: req.user, message: 'No posts?' });
		}
	})
});

router.post('/', mylogin({allowGuest:true}), upload.any(), function(req, res, next) {
	if (req.user.id == 0)
		res.sendStatus(403);
	if (req.body['post-type'] == 'text')
	{
		console.log(req.body);

		const stringTags = req.body['tags'].length > 2 ? JSON.stringify(req.body['tags'].split(', ').map(t => [t, sluggify(t)])) : '';
		var timestamp = Date.time()
		var uuid = uuidv1();
		db.query("INSERT INTO posts SET ?", {
			'id': uuid,
			'user-id': req.user.id,
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
			db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN follows ON posts.`user-id`=follows.target LEFT JOIN users ON users.id=posts.`user-id` WHERE posts.id = ?", [uuid], function (error, results, fields) {
				if (error) throw error;
				res.render('partials/post-loop', { posts: results, newPost: false, user: req.user, message: '' });
			});
		});
		//res.send("lol");
	}
});

router.get('/tags/:tag', mylogin({allowGuest:true}), function(req, res, next) {
	db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE tags LIKE ? ORDER BY `posted-on` DESC", ['%"'+req.params['tag']+'"%'], function (error, results, fields) {
		if (error) throw error;
		if (results.length) {
			res.render('posts', { posts: results, newPost: false, user: req.user, message: 'Showing posts with tag \'' + req.params['tag'] + '\'' });
		}
		else {
			res.render('posts-error', { message: 'No results for this tag.' });
		}
	})
});

router.get('/dashboard/profile', mylogin({allowGuest:false}), function (req, res, next) {
	db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE posts.`user-id`=? ORDER BY `posted-on` DESC",
	[req.user.id], function (error, results, fields) {
		if (error) throw error;
		if (results.length) {
			res.render('posts', { posts: results, newPost: true, message: '', user: req.user });
		}
		else {
			res.render('posts-error', { message: 'No posts?', user: req.user });
		}
	})
});

router.get('/dashboard/:user', mylogin({allowGuest:false}), function (req, res, next) {
	if (req.cookies['dumblr_id'] && req.cookies['dumblr_password']) {
		db.query("SELECT * FROM `users` WHERE (id=? AND `password-hash`=?) OR (`parent-id`=?) ORDER BY id", [req.cookies['dumblr_id'], req.cookies['dumblr_password'], req.cookies['dumblr_id']], function (error, results, fields) {
			if (results.length) {
				var i = results.findIndex(e => e['handle'] == req.params.user)
				if (i != -1) {
					req.user = results.splice(i, 1)[0];
					req.user.dashColor = '#' + req.user.dashColor;
					req.user.otherBlogs = results;

					db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE posts.`user-id`=? ORDER BY `posted-on` DESC", [req.user.id], function (error, results, fields) {
						if (error) throw error;
						if (results.length) {
							res.render('posts', { posts: results, newPost: true, user: req.user, message: '' });
						}
						else {
							res.render('posts-error', { user: req.user, message: 'eeeeh?' });
						}
					});

				}
				else
				{
					req.user = results.shift();
					req.user.dashColor = '#' + req.user.dashColor;
					req.user.otherBlogs = results;

					res.render('posts-error', { user: req.user, message: 'Blog does not exist or is not yours.' });
				}
			}
			else {
				res.render('login', { user: req.user, message: 'Invalid login state.', rndBack: global.grabRandomBackground() });
			}

		})
	}
	else {
		res.render('login', { user: req.user, message: '', rndBack: global.grabRandomBackground() });
	}
});



module.exports = router;
