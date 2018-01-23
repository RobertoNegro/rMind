var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

var config = require('../config');
var user = require('../models/user');

router.get('/:id', function (req, res) {
	user.findById(req.params.id, {
		password: 0,
		memos: 0
	}, function (err, u) {
		if (err)
			return res.status(500).send({
				error: true,
				message: "There was a problem finding the user."
			});
		if (!u)
			return res.status(404).send({
				error: true,
				message: "No user found."
			});

		res.status(200).send(u);
	});
});

module.exports = router;
