var express = require('express');
var router = express.Router();
var mylogin = require('../login.js')

router.get('/user/:user/post/:post', mylogin({allowGuest:true}), function(req, res, next) {
	//if (global.notUsers.includes(req.params['user'])) { next(); return; }
	req.params['post'] = parseInt(req.params['post']);
	db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE users.handle=? AND posts.id=?", [req.params['user'], req.params['post']], function (error, results, fields) {
		if (error) throw error;
		if (results.length)
			res.render('posts', { posts: results, newPost: false, user: req.user, message: 'Showing specific post from \'' + req.params['user'] + '\'' });
		else
			res.render('posts-error', { user: req.user, message: 'No such post.' });
	});
});

router.get('/user/:user', mylogin({allowGuest:true}), function(req, res, next) {
	//if (global.notUsers.includes(req.params['user'])) { next(); return; }
	db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE users.handle=? ORDER BY `posted-on` DESC", [req.params['user']], function (error, results, fields) {
		if (error) throw error;
		if (results.length)
			res.render('posts', { posts: results, newPost: false, user: req.user, message: 'Showing posts from \'' + req.params['user'] + '\'' });
		else
			res.render('posts-error', { message: 'Nothing here~' });
	});
});

module.exports = router;
