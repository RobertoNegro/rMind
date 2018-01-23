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

// CREATE
router.post('/', middlewares.verifyToken, function (req, res) {
	console.log("Creating memo");
	
	var dateS = req.body.date;
	var date = new Date(dateS);
	
	if(dateS.indexOf('T') < 0)
		date.setHours(12);
	
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
		if(req.body.text) {
			for(var i = 0; i < memos.length; i++) {
				if(memos[i].text.toLowerCase().indexOf(req.body.text.trim().toLowerCase()) < 0) {
					memos.splice(i--, 1);
				}
			}
		}
		
		if(req.body.date) {
			var dateS = req.body.date;
			
			if(dateS.indexOf('T') > 0) {
				var date = new Date(dateS);
				for(var i = 0; i < memos.length; i++) {
					if(memos[i].date.getFullYear() === date.getFullYear() && 
    				memos[i].date.getMonth() === date.getMonth() && 
    				memos[i].date.getDate() === date.getDate() && 
						memos[i].date.getHours() >= (date.getHours() > 0 ? date.getHours() - 1 : 0) && 
						memos[i].date.getHours() <= (date.getHours() < 23 ? date.getHours() + 1 : 23)) {
						// its ok
					} else 						
						memos.splice(i--, 1);
				}
			} else if(dateS.indexOf('/') > 0) {
				var dateStart = new Date(dateS.substring(0, dateS.indexOf('/')));
				var dateEnd = new Date(dateS.substring(dateS.indexOf('/')+1));
				dateEnd.setHours(dateEnd.getHours() + 24);
				
				for(var i = 0; i < memos.length; i++) {
					if(memos[i].date < dateStart || memos[i].date > dateEnd)				
						memos.splice(i--, 1);
				}
			} else {
				var dateStart = new Date(dateS);
				var dateEnd = new Date(dateS);
				dateEnd.setHours(dateEnd.getHours() + 24);
				
				for(var i = 0; i < memos.length; i++) {
					if(memos[i].date < dateStart || memos[i].date > dateEnd)				
						memos.splice(i--, 1);
				}
			}						
		}

		res.status(200).send(memos);
	});
});

// UPDATE
router.put('/:id', middlewares.verifyToken, function (req, res) {
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
router.delete('/:id', middlewares.verifyToken, function (req, res) {
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
