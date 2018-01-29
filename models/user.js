var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var schemaTypes = mongoose.Schema.Types;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var constants = require('../config/constants');

// schemas
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
// --

function validString(str) {
	var isString = str != null && str != undefined && (typeof str === 'string' || str instanceof String);
	return isString && (str.trim()).length > 0;
}

// static functions
function hash(password, callback) {	
	if (!validString(password))
		return callback(new Error("No password passed as argument"), null);

	bcrypt.hash(password, 10, function (err, hashedPassword) {
		return callback(err, hashedPassword);
	});
}

function signup(email, username, password, avatar, callback) {
	if(!validString(email) || !validString(username) || !validString(password))
		return callback(new Error("Missing parameters"), null);
	
	email = email.toLowerCase();

	hash(password, function (err, hashedPassword) {
		var newUser = {
			username: username,
			email: email,
			password: hashedPassword
		};
		
		if(avatar) 
			newUser['avatar'] = avatar;
		
		user.create(newUser,
			function (err, u) {
				u['memos'] = undefined;
				u['password'] = undefined;
				return callback(null, u);
			});
	});
}

function read(id, callback) {
	if(!validString(id))
		return callback(new Error("Missing parameters"), null);
	
	user.findById(id, {
		password: 0,
		memos: 0
	}, function (err, u) {
		if (err) return callback(err, null);			
		return callback(null, u);
	});
}

function change(id, email, username, password, avatar, callback) {
	if(!validString(id))
		return callback(new Error("Missing parameters"), null);
	
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
	
	var options = { new: true };

	user.findByIdAndUpdate(id, update, options, function (err, u) {
		if (err) return callback(err, null);		

		u['memos'] = undefined;
		u['password'] = undefined;
		return callback(null, u);
	});
}

function remove(id, callback) {
	if(!validString(id))
		return callback(new Error("Missing parameters"), null);
	
	user.findByIdAndRemove(id, function (err, u) {
		if (err) return callback(err, null);			
		return callback(null, u);
	});
}

function authenticate(email, password, callback) {
	if(!validString(email) || !validString(password))
		return callback(new Error("Missing parameters"), null);
	
	email = email.toLowerCase();

	user.findOne({
		email: email
	}, {
		memos: 0
	}, function (err, u) {
		if (!u)
			return callback(new Error("Email not recognized"), null);

		bcrypt.compare(password, u.password, function (err, result) {
			if (result === true) {
				var token = jwt.sign({
					id: u._id
				}, constants.tokenSecret, {
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

userSchema.statics.validString = validString;
userSchema.statics.hash = hash;
userSchema.statics.signup = signup;
userSchema.statics.authenticate = authenticate;
userSchema.statics.remove = remove;
userSchema.statics.change = change;
userSchema.statics.read = read;

// --

var user = mongoose.model('User', userSchema);
module.exports = user;
