var mongoose = require('mongoose') require('mongoose-double')(mongoose);
var schemaTypes = mongoose.Schema.Types;

var UserSchema = new mongoose.Schema({
	email: String,
	username: String,
	password: String,
	avatar: String,

	memos: [{

		date: Date,
		text: String,

		link: [{
			url: String,
			desc: String
		}],

		photo: [{
			path: String,
			desc: String
		}],

		location: [{
			lat: schemaTypes.Double,
			lng: schemaTypes.Double,
			desc: String
		}]

	}]
});
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
