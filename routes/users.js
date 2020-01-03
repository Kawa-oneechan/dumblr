var express = require('express');
var router = express.Router();

router.get('/:user/:post', function(req, res, next) {
	req.params['post'] = parseInt(req.params['post']);
	req.app.locals.connection.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE users.handle=? AND posts.id=?", [req.params['user'], req.params['post']], function (error, results, fields) {
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

router.get('/:user', function(req, res, next) {
	req.app.locals.connection.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE users.handle=? ORDER BY `posted-on` DESC", [req.params['user']], function (error, results, fields) {
		if (error) throw error;
		if (results.length)
			res.render('posts', { posts: results });
		else
			res.render('posts-error', { message: 'Nothing here~' });
	});
});

module.exports = router;
