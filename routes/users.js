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
		'<% post[\'photos\'].forEach(function(photo, i) { %>': /{block:Photos}/g,
		'<% }); %>': /{\/block:(Posts|Photos)}/g,

		'<% if(post[\'post-type\'] === \'text\') { %>': /{block:Text}/g,
		'<% if(post[\'post-type\'] === \'photo\') { post[\'photos\'] = JSON.parse(post[\'photos\']); var photo = post[\'photos\'][0]; %>': /{block:Photo}/g,
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

router.get('/user/:user/post/:post', mylogin({allowGuest:true}), function(req, res, next) {
	req.params['post'] = parseInt(req.params['post']);
	db.query("SELECT * FROM themes RIGHT JOIN users ON themes.id=users.id WHERE users.handle=?", [req.params['user']], function (error, results, fields) {
		if (error) throw error;
		theme = results[0];
		if (!theme['main-template']) theme['main-template'] = defaultTemplate;
		console.log(theme);
		var mainTemplate = convertTheme(theme['main-template']);

		db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE users.handle=? AND posts.id=?", [req.params['user'], req.params['post']], function (error, results, fields) {
			if (error) throw error;
			if (results.length) {
				let t = ejs.render(mainTemplate, { posts: results, theme: theme, user: req.user, message: '' });
				res.send(t);
			}
			else
				res.render('posts-error', { user: req.user, message: 'No such post.' });
		})
	});
});


router.get('/user/:user', mylogin({allowGuest:true}), function(req, res, next) {
	db.query("SELECT * FROM themes RIGHT JOIN users ON themes.id=users.id WHERE users.handle=?", [req.params['user']], function (error, results, fields) {
		if (error) throw error;
		theme = results[0];
		if (!theme['main-template']) theme['main-template'] = defaultTemplate;
		console.log(theme);
		var mainTemplate = convertTheme(theme['main-template']);

		db.query("SELECT posts.*, users.handle, users.title AS `user-title` FROM posts LEFT JOIN users ON users.id=posts.`user-id` WHERE users.handle=? ORDER BY `posted-on` DESC", [req.params['user']], function (error, results, fields) {
			if (error) throw error;
			if (results.length) {
				let t = ejs.render(mainTemplate, { posts: results, theme: theme, user: req.user, message: '' });
				res.send(t);
			}
			else
				res.render('posts-error', { message: 'Nothing here~' });
		})
	});
});

module.exports = router;
