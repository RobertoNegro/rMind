var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var config = require('../config');

var schemaTypes = mongoose.Schema.Types;


var linkSchema = new mongoose.Schema({
	url: String,
	desc: String
});

var photoSchema = new mongoose.Schema({
	path: String,
	desc: String
});

var locationSchema = new mongoose.Schema({
	lat: schemaTypes.Double,
	lng: schemaTypes.Double,
	desc: String
});

var memoSchema = new mongoose.Schema({
	date: Date,
	text: String,

	link: [linkSchema],
	photo: [photoSchema],
	location: [locationSchema]
});

var userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},

	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},

	password: {
		type: String,
		required: true
	},

	avatar: String,

	memos: [memoSchema]
});

function hash(password, callback) {
	if (!password)
		return callback(new Error("No password passed as argument"), null);

	bcrypt.hash(password, 10, function (err, hashedPassword) {
		if (!hashedPassword)
			return callback(new Error("Can't generate hashed password"), null);

		return callback(err, hashedPassword);
	});
}

userSchema.statics.hash = hash;

userSchema.statics.signup = function (email, username, password, callback) {
	email = email.toLowerCase();

	hash(password, function (err, hashedPassword) {
		if (err) return callback(err, null);
		if (!hashedPassword) return callback(new Error("Error on hashing the password (null password)"), null);

		user.create({
				username: username,
				email: email,
				password: hashedPassword
			},
			function (err, u) {
				if (err) return callback(err, null);
				if (!u) return callback(null, null);

				u['memos'] = undefined;
				u['password'] = undefined;
				return callback(null, u);
			});
	});
}

userSchema.statics.authenticate = function (email, password, callback) {
	email = email.toLowerCase();

	user.findOne({
		email: email
	}, {
		memos: 0
	}, function (err, u) {
		if (err)
			return callback(err);
		if (!u)
			return callback(new Error("Email not recognized"), null);

		bcrypt.compare(password, u.password, function (err, result) {
			if (result === true) {
				var token = jwt.sign({
					id: u._id
				}, config.secret, {
					expiresIn: 86400
				});

				u['memos'] = undefined;
				u['password'] = undefined;

				return callback(null, {
					token: token,
					user: u
				});
			} else
				return callback(new Error("Invalid password"), null);
		});
	});
}

var user = mongoose.model('User', userSchema);
module.exports = user;
