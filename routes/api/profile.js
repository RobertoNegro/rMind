var debug = require('debug')('rmind:profile');
var express = require('express');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var user = require('../../models/user');
var middlewares = require('../../config/middlewares');

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

function checkPreviousAvatar(id, email, username, password, avatar, res) {
	if (avatar && avatar.type.indexOf('image/', 0) === 0) {
		user.findById(id, function (err, u) {
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

			if (u['avatar']) {
				var file = __dirname + '/../public/users/' + id + '/' + u['avatar'];
				fs.unlink(file, function (err) {
					if (err && err.code != 'ENOENT')
						return res.status(500).send({
							error: true,
							message: "There was a problem removing previous avatar file.",
							internal: err.message
						});
					return saveNewAvatar(id, email, username, password, avatar, res);
				})
			} else {
				return saveNewAvatar(id, email, username, password, avatar, res);
			}
		});
	} else {
		return saveNewAvatar(id, email, username, password, avatar, res);
	}
}

function saveNewAvatar(id, email, username, password, avatar, res) {
	var filename;

	if (avatar && avatar.type.indexOf('image/', 0) === 0) {
		var oldpath = avatar.path;

		var re = /(?:\.([^.]+))?$/;
		var ext = re.exec(avatar.name)[1];
		filename = 'avatar_' + avatar.hash + '.' + ext;
		var dir = __dirname + '/../public/users/' + id;

		mkdirp(dir, function (err) {
			if (err)
				return res.status(500).send({
					error: true,
					message: "There was a problem creating directories.",
					internal: err.message
				});

			var newpath = dir + '/' + filename;

			fs.rename(oldpath, newpath, function (err) {
				if (err)
					return res.status(500).send({
						error: true,
						message: "There was a problem saving the avatar.",
						internal: err.message
					});

				return editUser(id, email, username, password, filename, res);
			});
		});
	} else {
		return editUser(id, email, username, password, filename, res);
	}
}

function editUser(id, email, username, password, avatarPath, res) {
	var update = {};
	update['$set'] = {};
	if (email)
		update['$set']['email'] = email;
	if (username)
		update['$set']['username'] = username;
	if (password)
		update['$set']['password'] = password;
	if (avatarPath)
		update['$set']['avatar'] = avatarPath;

	debug("[UPDATING USER]");
	debug(update);

	user.findByIdAndUpdate(id, update, {
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

		u['password'] = undefined;
		u['memos'] = undefined;
		res.status(200).send(u);
	});
}

// Edit user
router.put('/', middlewares.verifyToken, function (req, res) {
	var form = new formidable.IncomingForm();
	form.hash = 'md5';
	form.parse(req, function (err, fields, files) {
		if (err)
			return res.status(500).send({
				error: true,
				message: "There was a problem parsing the request",
				internal: err.message
			});

		var id = req.userId;
		var email = fields.email;
		var username = fields.username;
		var password = fields.password;
		var avatar = files.avatar;

		if (password) {
			return user.hash(password, function (err, hashedPassword) {
				if (err) {
					return res.status(500).send({
						error: true,
						message: "There was a problem hashing the password.",
						internal: err.message
					});
				}

				checkPreviousAvatar(req.userId, email, username, hashedPassword, avatar, res);
			});
		} else {
			checkPreviousAvatar(req.userId, email, username, password, avatar, res);
		}
	});
});

// Add user
router.post('/', function (req, res) {
	var form = new formidable.IncomingForm();
	form.hash = 'md5';
	form.parse(req, function (err, fields, files) {
		if (err)
			return res.status(500).send({
				error: true,
				message: "There was a problem parsing the request",
				internal: err.message
			});
		var email = fields.email;
		var username = fields.username;
		var password = fields.password;

		if (email && username && password) {
			user.signup(email, username, password, function (err, u) {
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

				var id = u._id;

				if (files.avatar.type.indexOf('image/', 0) === 0) {
					var oldpath = files.avatar.path;

					var re = /(?:\.([^.]+))?$/;
					var ext = re.exec(files.avatar.name)[1];
					var filename = 'avatar_' + files.avatar.hash + '.' + ext;
					var dir = __dirname + '/../public/users/' + id;

					rimraf(dir, function (err) {
						if (err && err.code != 'ENOENT')
							return res.status(500).send({
								error: true,
								message: "There was a problem removing previous directory.",
								internal: err.message
							});

						mkdirp(dir, function (err) {
							if (err)
								return res.status(500).send({
									error: true,
									message: "There was a problem creating directories.",
									internal: err.message
								});

							var newpath = dir + '/' + filename;

							fs.rename(oldpath, newpath, function (err) {
								if (err)
									return res.status(500).send({
										error: true,
										message: "There was a problem saving the avatar.",
										internal: err.message
									});

								user.findByIdAndUpdate(id, {
									$set: {
										avatar: filename
									}
								}, {
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

									user.authenticate(email, password, function (err, token) {
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

										res.status(200).send(token);
									});
								});
							});
						});
					});
				} else {
					user.authenticate(email, password, function (err, token) {
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

						res.status(200).send(token);
					});
				}
			});
		} else {
			res.status(400).send({
				error: true,
				message: "Missing parameters"
			});
		}
	});
});

// Delete user
router.delete('/', middlewares.verifyToken, function (req, res) {
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

		var dir = __dirname + '/../public/users/' + req.userId;
		rimraf(dir, function (err) {
			if (err && err.code != 'ENOENT')
				return res.status(500).send({
					error: true,
					message: "There was a problem removing previous directory.",
					internal: err.message
				});

			return res.status(200).send({
				error: false
			});
		});
	});
});


module.exports = router;
