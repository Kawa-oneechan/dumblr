module.exports = function(options) {
	return function(req, res, next) {
		//console.log('login check!');
		if (req.user) {
			//console.log('already have a req.user...');
			if ((options && options.allowGuest) && req.user.id == 0)
			{
				//console.log('...but they are guest on a no-guest page!');
				res.render('login', { message: '', rndBack: global.grabRandomBackground() });
			}
			next();
			return;
		}
		//console.log(options);
		if (req.cookies['dumblr_id'] && req.cookies['dumblr_password']) {
			db.query("SELECT * FROM `users` WHERE (id=? AND `password-hash`=?) OR (`parent-id`=?) ORDER BY id", [req.cookies['dumblr_id'], req.cookies['dumblr_password'], req.cookies['dumblr_id']], function (error, results, fields) {
				if (results.length) {
					req.user = results.shift();
					if (req.user['dash-color'])
						req.user['dash-color'] = '#' + req.user['dash-color'];
					req.user.otherBlogs = results;
					console.log(req.user);

					next();
					return;
				}
				else if (options && options.allowGuest) {
					//console.log("Using guest account.");
					req.user = {
						'id': 0,
						'parent-id': 0,
						'handle': '',
						'title': 'Guest',
						'password-hash': '*',
						'dash-color': '',
						'personal-color': '',
						'all-nsfw': 0,
						'show-nsfw': 0,
						'otherBlogs': {}
					}
					next();
				}
				else
				{
					//console.log('login middleware says to render login page for invalid login state.');
					res.render('login', { message: 'Invalid login state.', rndBack: global.grabRandomBackground() });
				}

			})
		}
		else {
			//console.log('login: no cookies...');
			if (options && options.allowGuest) {
				//console.log("Using guest account.");
				req.user = {
					'id': 0,
					'parent-id': 0,
					'handle': '',
					'title': 'Guest',
					'password-hash': '*',
					'dash-color': '',
					'personal-color': '',
					'all-nsfw': 0,
					'show-nsfw': 0,
					'otherBlogs': {}
				}
				next();
			}
			else
			{
				//console.log('login middleware says to render login page for no guest allowed.');
				res.render('login', { message: '', rndBack: global.grabRandomBackground() });
			}
		}
	};
};
