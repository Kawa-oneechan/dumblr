module.exports = function(options) {
	return function(req, res, next) {
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
	};
};
