const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const mylogin = require('../login.js')

const defaultTemplate = `<html>
	<head>
		<title>{BlogTitle}</title>
	</head>
	<body>
		(no theme found y'all.)
		{block:Posts}
			{block:Text}
				{block:Title}<h1>{Title}</h1>{/block:Title}
				{Body}
			{/block:Text}
			{block:Photo}
				<img src="{PhotoURL}">
			{/block:Photo}
			{block:Photoset}
				{block:Photos}
					<img src="{PhotoURL}">
				{/block:Photos}
			{/block:Photoset}
		{/block:Posts}
	</body>
</html>`

router.get('/api/user/:user/post/:post', express.json(), function(req, res, next) {
	req.params['post'] = parseInt(req.params['post']);
	db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE users.handle=? AND posts.id=?", [req.params['user'], req.params['post']], function (error, results, fields) {
		if (error) throw error;
		res.send(results);
	});
});

router.get('/api/user/:user', express.json(), function(req, res, next) {
	req.params['post'] = parseInt(req.params['post']);
	db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE users.handle=? ORDER BY `posted-on` DESC", [req.params['user'], req.params['post']], function (error, results, fields) {
		if (error) throw error;
		res.send(results);
	});
});

function convertTheme(theme)
{
	/*
	console.log('Asked to convert:');
	console.log('-----------------');
	console.log(theme);
	console.log('-----------------');
	*/

	const things = {
		'&lt;%': /<%/g,
		'%&gt;': /%>/g,

		'<%=theme[\'title\']%>': /{BlogTitle}/g,
		'<% posts.forEach(function(post) { %>': /{block:Posts}/g,
		'<% post[\'photos\'][\'photos\'].forEach(function(photo, i) { %>': /{block:Photos}/g,
		'<% }); %>': /{\/block:(Posts|Photos)}/g,

		'<% if(post[\'post-type\'] === \'text\') { %>': /{block:Text}/g,
		'<% if(post[\'post-type\'] === \'photo\') { post[\'photos\'] = JSON.parse(post[\'photos\']); var photo = post[\'photos\'][\'photos\'][0]; %>': /{block:Photo}/g,
		'<% if(post[\'post-type\'] === \'photoset\') { post[\'photos\'] = JSON.parse(post[\'photos\']); %>': /{block:Photoset}/g,
		'<% if(post[\'title\']) { %>': /{block:Title}/g,
		'<% } %>': /{\/block:(Text|Title|Photo|Photoset)}/g,

		'<%=entities.decode(post[\'title\'])%>': /{Title}/g,
		'<%-markdown(post[\'body-text\']) %>': /{Body}/g,

		'<%=photo[\'url\']%>': /{PhotoURL}/g, //TODO: max width thing
	}

	for (const thing in things) {
		theme = theme.replace(things[thing], thing);
	}

	/*
	console.log(theme);
	console.log('-----------------');
	*/
	return theme;
}

getTheme = function(options) {
	return function(req, res, next) {
		db.query("SELECT * FROM themes RIGHT JOIN users ON themes.id=users.id WHERE users.handle=?", [req.params['user']], function (error, results, fields) {
			if (error) throw error;
			req.theme = results[0];
			if (!req.theme['main-template']) req.theme['main-template'] = defaultTemplate;
			//console.log(req.theme);
			req.mainTemplate = convertTheme(req.theme['main-template']);
			next();
		})
	}
}

function createErrorPosts(message) {
	return [{
		'id': 0,
		'post-type': 'text',
		'body-text': message,
	}];
	//perhaps have the theme converter recognize the fake ID and not render anything to interact with the post...
}

router.get('/user/:user/post/:post', mylogin({allowGuest:true}), getTheme(), function(req, res, next) {
	req.params['post'] = parseInt(req.params['post']);
	db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE users.handle=? AND posts.id=?", [req.params['user'], req.params['post']], function (error, results, fields) {
		if (error) throw error;
		if (!results.length)
			results = createErrorPosts('No such post.');
		let t = ejs.render(req.mainTemplate, { posts: results, theme: req.theme, user: req.user, message: '' });
		res.send(t);
	})
});


router.get('/user/:user', mylogin({allowGuest:true}), getTheme(), function(req, res, next) {
	db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE users.handle=? ORDER BY `posted-on` DESC", [req.params['user']], function (error, results, fields) {
		if (error) throw error;
		if (!results.length)
			results = createErrorPosts('Nothing here yet.');
		let t = ejs.render(req.mainTemplate, { posts: results, theme: req.theme, user: req.user, message: '' });
		res.send(t);
	})
});

module.exports = router;
