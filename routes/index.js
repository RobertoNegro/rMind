var express = require('express');
var router = express.Router();
var request = require('request');

var middlewares = require('../config/middlewares');
var constants = require('../config/constants');

router.get('/', function (req, res, next) {
	var token = middlewares.getToken(req);
	if (token) {
		res.render('index', {
			title: 'rMind'
		});
	} else {
		res.render('login', {
			title: 'rMind'
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
				message: 'Login returned status code '+result.statusCode
			});
		} else {
			res.cookie('token', data.token);			
			res.redirect('/');
		}
	});
});

module.exports = router;
