var debug = require('debug')('rmind:profile');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

var user = require('../models/user');
var verifyToken = require('../mid/token');

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
router.get('/me', verifyToken, function (req, res) {
	user.findById(req.userId, {
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

function editUser(req, res, email, username, password, avatar) {
	var update = {};
	update['$set'] = {};
	if (email)
		update['$set']['email'] = email;
	if (username)
		update['$set']['username'] = username;
	if (password)
		update['$set']['password'] = password;
	if (avatar)
		update['$set']['avatar'] = avatar;

	debug("[UPDATING USER]");
	debug(update);

	user.findByIdAndUpdate(req.userId, update, {
		new: true
	}, function (err, u) {
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
	});
}

// Edit user
router.put('/', verifyToken, function (req, res) {
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var avatar = req.body.avatar;

	if(password) {
		return user.hash(password, function(err, hashedPassword) {
			if(err) {
				return res.status(500).send({
					error: true,
					message: "There was a problem hashing the password.",
					internal: err.message
				});
			}

			editUser(req, res, email, username, hashedPassword, avatar);
		});
	} else {
		editUser(req, res, email, username, password, avatar);
	}
});

// Add user
router.post('/', function (req, res) {
	// TODO: AGGIUNTA AVATAR

	if (req.body.email && req.body.username && req.body.password) {
		user.signup(req.body.email, req.body.username, req.body.password, req.body.avatar, function (err, token) {
			if (err)
				return res.status(500).send({
					error: true,
					message: "There was a problem creating the user",
					internal: err.message
				});

			if (!token)
				return res.status(401).send({
					error: true,
					message: 'Can\'t obtain token'
				});

			res.status(200).send(token);
		});
	} else {
		res.status(400).send({
			error: true,
			message: "Missing parameters"
		});
	}
});

// Delete user
router.delete('/', verifyToken, function (req, res) {
	user.findByIdAndRemove(req.userId, function (err, u) {
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
