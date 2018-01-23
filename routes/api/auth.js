var express = require('express');

var bodyParser = require('body-parser');
var user = require('../../models/user');

var router = express.Router();
router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

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
