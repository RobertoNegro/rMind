var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: String,
	username: String,
  password: String,
	avatar: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
