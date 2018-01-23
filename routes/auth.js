var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

var config = require('../config');
var user = require('../models/user');

router.post('/signup', function (req, res) {
	if (req.body.email && req.body.username && req.body.password) {
		// TODO: Upload avatar
		user.create({
				username: req.body.username,
				email: req.body.email,
				password: req.body.password,
				avatar: req.body.avatar
			},
			function (err, u) {
				if (err)
					return res.status(500).send({ error: true, message: "There was a problem creating the user."});

				user.authenticate(req.body.email, req.body.password, function (err, token) {
					if (err)
						return res.status(500).send({ error: true, message: 'There was a problem finding the user.'});
					if (!token)
						return res.status(401).send({ error: true, message: 'No user found.'});

					res.status(200).send({
						token: token
					});
				});
			});
	} else
		res.status(400).send({ error: true, message: "Missing parameters"});
});

router.post('/login', function (req, res) {
	user.authenticate(req.body.email, req.body.password, function (err, token) {
		if (err)
			return res.status(500).send({ error: true, message: 'There was a problem finding the user.'});
		if (!token)
			return res.status(401).send({ error: true, message: 'No user found.'});

		res.status(200).send({
			token: token
		});
	});
});



module.exports = router;
