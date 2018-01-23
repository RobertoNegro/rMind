var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

var config = require('../config');
var user = require('../models/user');

router.get('/', function (req, res) {
	user.authenticate(req.body.email, req.body.password, function (err, token) {
		if (err)
			return res.status(500).send({
				error: true,
				message: 'There was a problem finding the user.',
				internal: err.message
			});
		if (!token)
			return res.status(401).send({
				error: true,
				message: 'No user found.'
			});

		res.status(200).send(token);
	});
});

module.exports = router;
