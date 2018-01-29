var debug = require('debug')('rmind:profile');
var express = require('express');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var user = require('../../../models/user');
var middlewares = require('../../../config/middlewares');

var router = express.Router();
router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

// Browse Users
router.get('/', function (req, res) {
	user.find({}, {
		password: 0,
		memos: 0
	}, function (err, users) {
		if (err)
			return res.status(500).send({
				error: true,
				message: "There was a problem finding users.",
				internal: err.message
			});
		if (!users)
			return res.status(404).send({
				error: true,
				message: "No users found."
			});

		res.status(200).send(users);
	});
});

// Read logged user
router.get('/me', middlewares.verifyToken, function (req, res) {
	user.read(req.userId, function (err, u) {
		if (err)
			return res.status(500).send({
				error: true,
				message: "There was a problem finding the user.",
				internal: err.message
			});
		if (!u)
			return res.status(404).send({
				error: true,
				message: "No user found."
			});

		res.status(200).send(u);
	});
});

// Read User
router.get('/:id', function (req, res) {
	user.findById(req.params.id, {
		password: 0,
		memos: 0
	}, function (err, u) {
		if (err)
			return res.status(500).send({
				error: true,
				message: "There was a problem finding the user.",
				internal: err.message
			});
		if (!u)
			return res.status(404).send({
				error: true,
				message: "No user found."
			});

		res.status(200).send(u);
	});
});

// Edit user
router.put('/', middlewares.verifyToken, function (req, res) {
	var id = req.userId;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var avatar = req.body.avatar;

	const callback = function(err, u) {
		if (err)
			return res.status(500).send({
				error: true,
				message: "There was a problem updating the user.",
				internal: err.message
			});
		if (!u)
			return res.status(404).send({
				error: true,
				message: "No user found."
			});

		res.status(200).send(u);
	};
	
	if (password) {
		user.hash(password, function (err, hashedPassword) {
			if (err) {
				return res.status(500).send({
					error: true,
					message: "There was a problem hashing the password.",
					internal: err.message
				});
			}

			user.change(id, email, username, hashedPassword, avatar, callback);
		});
	} else {
		user.change(id, email, username, password, avatar, callback);
	}
});

// Add user
router.post('/', function (req, res) {
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var avatar = req.body.avatar;				

	if (email && username && password) {
		user.signup(email, username, password, avatar, function (err, u) {
			if (err)
				return res.status(500).send({
					error: true,
					message: "There was a problem creating the user",
					internal: err.message
				});

			if (!u)
				return res.status(401).send({
					error: true,
					message: 'Can\'t obtain user'
				});

			user.authenticate(email, password, function (err, token) {
				if (err)
					return res.status(500).send({
						error: true,
						message: "There was a problem authenticating the user.",
						internal: err.message
					});
				if (!u)
					return res.status(404).send({
						error: true,
						message: "No user found."
					});

				res.status(200).send(token);
			});
		});
	} else {
		res.status(400).send({
			error: true,
			message: "Missing parameters"
		});
	}
});

// Delete user
router.delete('/', middlewares.verifyToken, function (req, res) {
	user.remove(req.userId, function(err, u) {
		if (err) {
			return res.status(500).send({
				error: true,
				message: "There was a problem removing the user.",
				internal: err.message
			});
		}
		if (!u) {
			return res.status(404).send({
				error: true,
				message: "No user found."
			});
		}
		return res.status(200).send({
				error: false
		});
	});
});


module.exports = router;
