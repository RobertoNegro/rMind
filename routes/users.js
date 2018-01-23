var express = require('express');

var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var User = require('../models/user');

router.post('/register', function (req, res) {
	var hashedPassword = bcrypt.hashSync(req.body.password, 8);

	// TODO: Upload avatar
	User.create({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
			avatar: req.body.avatar
		},
		function (err, user) {
			if (err) return res.status(500).send("There was a problem creating the user.");

			var token = jwt.sign({
				id: user._id
			}, config.secret, {
				expiresIn: 86400
			}); // expires in 24 hours

			res.status(200).send({
				auth: true,
				token: token
			});
		});
});

router.post('/login', function (req, res) {
	User.findOne({
		email: req.body.email
	}, function (err, user) {
		if (err) return res.status(500).send('There was a problem finding the user.');
		if (!user) return res.status(404).send('No user found.');

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) return res.status(401).send({
			auth: false,
			token: null
		});

		var token = jwt.sign({
			id: user._id
		}, config.secret, {
			expiresIn: 86400
		}); // expires in 24 hours

		res.status(200).send({
			auth: true,
			token: token
		});
	});
});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
