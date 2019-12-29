var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	//res.render('index', { title: 'Express' });
	console.log('Cookies: ', req.cookies);
	if (req.cookies['dumblr_id']) {
		let my_id = req.cookies['dumblr_id'];

		app.locals.connection.query("SELECT posts.*, users.handle FROM posts LEFT JOIN follows ON posts.user=follows.target LEFT JOIN users ON users.id=posts.user WHERE follows.follower=" + my_id + " ORDER BY timestamp DESC", function (error, results, fields) {
			if (error) throw error;
			if (results.length) {
				for (i = 0; i < results.length; i++)
				{
					let result = results[i];
					console.log(result);
				}
			}
		});
	}
});

module.exports = router;
