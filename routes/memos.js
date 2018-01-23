var debug = require('debug')('rmind:memos');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

var user = require('../models/user');
var verifyToken = require('../mid/token');

// CREATE
router.post('/', verifyToken, function (req, res) {
	var memo = {
		date: new Date(req.body.date),
		text: req.body.text
	};

	user.findByIdAndUpdate(req.userId, {
		$push: {
			memos: memo
		}
	}, {
		new: true
	}, function (err, u) {
		if (err) {
			return res.status(500).send({
				error: true,
				message: "There was a problem updating the user.",
				internal: err
			});
		}

		if (!u) {
			return res.status(404).send({
				error: true,
				message: "No user found."
			});
		}

		res.status(200).send(u.memos[u.memos.length - 1]);
	});
});

// READ
router.get('/', verifyToken, function (req, res) {
	user.findById(req.userId, {
		password: 0
	}, function (err, u) {
		if (err) {
			return res.status(500).send({
				error: true,
				message: "There was a problem finding the user.",
				internal: err
			});
		}

		if (!u) {
			return res.status(404).send({
				error: true,
				message: "No user found."
			});
		}

		res.status(200).send(u.memos);
	});
});

// UPDATE
router.put('/:id', verifyToken, function (req, res) {
	var tokenId = req.userId;
	var id = req.params.id;

	var date = req.body.date;
	var text = req.body.text;

	var update = {};
	update['$set'] = {};

	if (date)
		update['$set']['memos.$.date'] = new Date(date);
	if (text)
		update['$set']['memos.$.text'] = text;

	debug('[UPDATING MEMO]');
	debug('id: ');
	debug(id);
	debug('update: ');
	debug(update);

	user.findOneAndUpdate({
		'_id': tokenId,
		'memos._id': id
	}, update, {
		new: true
	}, function (err, u) {
		if (err) {
			debug(err);
			return res.status(500).send({
				error: true,
				message: "There was a problem updating the memo.",
				internal: err
			});
		}
		if (!u) {
			return res.status(404).send({
				error: true,
				message: "No user found."
			});
		}

		res.status(200).send(u.memos.id(id));
	});
});

// DELETE
router.delete('/:id', verifyToken, function (req, res) {
	var tokenId = req.userId;
	var id = req.params.id;

	user.findOneAndUpdate({
		'_id': tokenId,
	}, {
		$pull: { memos: { _id: id } }
	}, {
		new: true
	}, function(err, u) {
		if (err) {
			debug(err);
			return res.status(500).send({
				error: true,
				message: "There was a problem removing the memo.",
				internal: err
			});
		}
		if (!u) {
			return res.status(404).send({
				error: true,
				message: "No user found."
			});
		}

		res.status(200).send(u.memos);
	});

});

module.exports = router;
