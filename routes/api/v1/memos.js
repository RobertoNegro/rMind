var debug = require('debug')('rmind:memos');
var express = require('express');
var bodyParser = require('body-parser');

var user = require('../../../models/user');
var middlewares = require('../../../config/middlewares');

var router = express.Router();
router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

function getDate(dateS) {	
	if (dateS.indexOf('/') >= 0)
		dateS = dateS.substring(0, dateS.indexOf('/'));

	if (dateS.indexOf('-') < 0) {
		var today = new Date();
		var month = today.getMonth() + 1;
		var day = today.getDate();
		dateS = today.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + 'T' + dateS + 'Z';
	}
	
	console.log("getDate [dateS]: "+ dateS);

	var date = new Date(dateS);
	if (dateS.indexOf('T') < 0)
		date.setHours(12);

	return date;
}

function getRangedDate(dateS) {
	var date1, date2;
	
	if (dateS.indexOf('/') >= 0) {
		// range di date
		date1 = getDate(dateS.substring(0, dateS.indexOf('/')));
		date2 = getDate(dateS.substring(dateS.indexOf('/') + 1));
		
		date2.setHours(date2.getHours() + 24);
	} else if(dateS.indexOf('T') >= 0) {
		// orario definito
		date1 = getDate(dateS);
		date2 = getDate(dateS);
		
		date1.setHours(date1.getHours() - 1);
		date2.setHours(date2.getHours() + 1);
	} else {
		// giorno definito
		date1 = getDate(dateS);
		date2 = getDate(dateS);
		
		date2.setDate(date2.getDate() + 1);
		date2.setHours(0,0,0,0);
	}
	
	return {
		start: date1,
		end: date2
	};
}

// CREATE
router.post('/', middlewares.verifyToken, function (req, res) {
	console.log("Creating memo");

	var dateS = req.body.date;
	var date = getDate(dateS);

	var memo = {
		date: date,
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
router.get('/', middlewares.verifyToken, function (req, res) {
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

		var memos = u.memos;
		if (req.body.text) {
			for (var i = 0; i < memos.length; i++) {
				if (memos[i].text.toLowerCase().indexOf(req.body.text.trim().toLowerCase()) < 0) {
					memos.splice(i--, 1);
				}
			}
		}

		if (req.body.date) {
			var dateS = req.body.date;
			var range = getRangedDate(dateS);
			var date = new Date(dateS);

			for (var i = 0; i < memos.length; i++) {
				if (memos[i].date < range.start || memos[i].date > range.end)
					memos.splice(i--, 1);
			}
		}

		res.status(200).send(memos);
	});
});

// UPDATE
router.put('/:id', middlewares.verifyToken, function (req, res) {
	var tokenId = req.userId;
	var id = req.params.id;

	var dateS = req.body.date;
	var text = req.body.text;
	
	var photo = req.body.photo;
	var location = req.body.location;
	var link = req.body.link;

	var update = {};
	
	update['$set'] = {};
	if (dateS) 
		update['$set']['memos.$.date'] = getDate(dateS);
	if (text)
		update['$set']['memos.$.text'] = text;
	
	update['$push'] = {};
	if(photo)
		update['$push']['memos.$.photo'] = photo;
	if(location)
		update['$push']['memos.$.location'] = location;
	if(link)
		update['$push']['memos.$.link'] = link;	

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
router.delete('/:id', middlewares.verifyToken, function (req, res) {
	var tokenId = req.userId;
	var id = req.params.id;

	user.findOneAndUpdate({
		'_id': tokenId,
	}, {
		$pull: {
			memos: {
				_id: id
			}
		}
	}, {
		new: true
	}, function (err, u) {
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
