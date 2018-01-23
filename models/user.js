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

	link: [ linkSchema ],
	photo: [ photoSchema ],
	location: [ locationSchema ]
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

	memos: [ memoSchema ]
});



userSchema.pre('save', function (next) {
	var user = this;
	bcrypt.hash(user.password, 10, function (err, hash) {
		if (err)
			return next(err);

		user.password = hash;
		next();
	})
});

userSchema.statics.authenticate = function (email, password, callback) {
	user.findOne({
		email: email
	}).exec(function (err, user) {
		if (err)
			return callback(err);
		if (!user)
			return callback(null, null);

		bcrypt.compare(password, user.password, function (err, result) {
			if (result === true) {
				var token = jwt.sign({
					id: user._id
				}, config.secret, {
					expiresIn: 86400
				}); // expires in 24 hours

				return callback(null, token);
			} else
				return callback(null, null);
		});
	});
}

var user = mongoose.model('User', userSchema);
module.exports = user;
