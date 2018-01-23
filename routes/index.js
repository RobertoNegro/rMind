var express = require('express');
var router = express.Router();
var request = require('request');

var middlewares = require('../config/middlewares');
var constants = require('../config/constants');

router.get('/', function (req, res, next) {
	var token = middlewares.getToken(req);
	if (token) {
		request.get({
			url: constants.rMindURL + 'api/profile/me',
			json: true,
			headers: {
				'User-Agent': 'request',
				'x-access-token': token
			}
		}, (err, result, data) => {
			if (err) {
				return res.status(500).send({
					error: true,
					message: 'There was a problem acquiring user information',
					internal: err
				});
			} else if (result.statusCode !== 200) {
				return res.status(500).send({
					error: true,
					message: 'Profile infos returned status code ' + result.statusCode
				});
			} else {
				res.render('index', {
					logged: true,
					user: data,
					turnBackButton: false
				});
			}
		});

	} else {
		res.render('login', {
			logged: false,
			user: null,
			turnBackButton: false
		});
	}
});

router.post('/login', function (req, res) {
	request.post({
		url: constants.rMindURL + 'api/auth',
		json: true,
		headers: {
			'User-Agent': 'request'
		},
		body: {
			'email': req.body.email,
			'password': req.body.password
		}
	}, (err, result, data) => {
		if (err) {
			return res.status(500).send({
				error: true,
				message: 'There was a problem during the login.',
				internal: err
			});
		} else if (result.statusCode !== 200) {
			return res.status(500).send({
				error: true,
				message: 'Login returned status code ' + result.statusCode
			});
		} else {
			res.cookie('token', data.token);
			res.redirect('/');
		}
	});
});

router.get('/logout', function (req, res) {
	res.cookie('token', '');
	res.redirect('/');
});

router.get('/account', function (req, res) {
	var token = middlewares.getToken(req);
	if (token) {
		request.get({
			url: constants.rMindURL + 'api/profile/me',
			json: true,
			headers: {
				'User-Agent': 'request',
				'x-access-token': token
			}
		}, (err, result, data) => {
			if (err) {
				return res.status(500).send({
					error: true,
					message: 'There was a problem acquiring user information',
					internal: err
				});
			} else if (result.statusCode !== 200) {
				return res.status(500).send({
					error: true,
					message: 'Profile infos returned status code ' + result.statusCode
				});
			} else {
				res.render('account', {
					logged: true,
					user: data,
					turnBackButton: true
				});
			}
		});
	} else {
		res.redirect('/');
	}
});

router.post('/account/set', middlewares.verifyToken, function (req, res) {
	var token = middlewares.getToken(req);
	if (token) {
		var username = req.body.username;
		if (username && username.trim().length === 0)
			username = null;

		var email = req.body.email;
		if (email && email.trim().length === 0)
			email = null;

		var password = req.body.password;
		if (password && password.trim().length === 0)
			password = null;

		var avatar = req.body.avatar;
		if (avatar && avatar.trim().length === 0)
			avatar = null;

		var body = {};
		if (username)
			body['username'] = username;
		if (email)
			body['email'] = email;
		if (password)
			body['password'] = password;
		if (avatar)
			body['avatar'] = avatar;

		request({
			url: constants.rMindURL + 'api/profile',
			method: 'PUT',
			headers: {
				'User-Agent': 'request',
				'x-access-token': token
			},
			json: body
		}, (err, result, data) => {
			if (err) {
				return res.status(500).send({
					error: true,
					message: 'There was a problem updating user information',
					internal: err
				});
			} else if (result.statusCode !== 200) {
				return res.status(500).send({
					error: true,
					message: 'Profile updating returned status code ' + result.statusCode
				});
			} else {
				res.redirect('/');
			}
		});
	} else {
		res.redirect('/');
	}
});


router.get('/signup', function (req, res) {
	res.render('signup', {
		logged: false,
		user: null,
		turnBackButton: true
	});
});


router.post('/signup/do', function (req, res) {
	var username = req.body.username;
	if (username && username.trim().length === 0)
		username = null;

	var email = req.body.email;
	if (email && email.trim().length === 0)
		email = null;

	var password = req.body.password;
	if (password && password.trim().length === 0)
		password = null;

	var avatar = req.body.avatar;
	if (avatar && avatar.trim().length === 0)
		avatar = null;

	var body = {};
	if (username)
		body['username'] = username;
	if (email)
		body['email'] = email;
	if (password)
		body['password'] = password;
	if (avatar)
		body['avatar'] = avatar;
	
	console.log(body);

	request({
		url: constants.rMindURL + 'api/profile',
		method: 'POST',
		json: true,
		headers: {
			'User-Agent': 'request'
		},
		json: body
	}, (err, result, data) => {
		if (err) {
			return res.status(500).send({
				error: true,
				message: 'There was a problem creating user',
				internal: err
			});
		} else if (result.statusCode !== 200) {
			return res.status(500).send({
				error: true,
				message: 'Profile creation returned status code ' + result.statusCode
			});
		} else {
			res.redirect('/');
		}
	});
});


module.exports = router;
