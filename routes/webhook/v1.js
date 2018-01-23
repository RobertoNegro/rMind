var debug = require('debug')('rmind:webhook');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var jwt = require('jsonwebtoken');
var middlewares = require('../../config/middlewares');
var constants = require('../../config/constants');

var router = express.Router();
router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

router.get('/', middlewares.verifyToken, function (req, res) {
	var message = req.body.message;
	if(!message) 
		message = req.query.message;	
	
	var token = req.headers['x-access-token'];
	if(!token)
		token = req.query.token;
	if(!token)
		token = req.body.token;
	if(!token)
		token = req.param.token;
	
	token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhNTc4NzhmZTJmM2YwMDAxNDRhMGI0NSIsImlhdCI6MTUxNTc2ODAyNywiZXhwIjoxNTE1ODU0NDI3fQ.jR50iIZG6kCaxYinQu69hjouLq87BGcMRQ_HS_dB-tA';
	
	var body = JSON.stringify({
		lang: 'en',
		query: message,
		sessionId: req.userId,
		contexts: [
			{
				name: 'auth',
				lifespan: 1,
				parameters: {
					token: token
				}
			}
		]
	});

	var options = {
		url: constants.dialogFlowURL,
		method: "POST",
		timeout: 10000,
		followRedirect: true,
		maxRedirects: 10,

		headers: {
			'Authorization': 'Bearer 1ada4d47f80f47c4a8c0bce82e75dbb6',
			'Content-Type': 'application/json'
		},

		body: body
	};

	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {			
			res.setHeader('Content-Type', 'application/json');
			res.status(200).send(body);
		} else {
			res.status(500).send({
				error: true,
				message: 'Something failed in DialogFlow',
				inner: error
			});
		}
	}

	request(options, callback);
});

function callCreateAPI(token, text, date, callback) {
	var url = constants.rMindURL + 'api/memos';
	request({
		url: url,
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': token
		},
		body: JSON.stringify({
			date: date,
			text: text
		})
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(null, body);
		} else {
			if (error)
				callback(error, null);
			else
				callback(new Error("CREATEAPI Returned status code " + response.statusCode), null);
		}
	});
}

function callReadAPI(token, text, date, callback) {
	var url = constants.rMindURL + 'api/memos';

	request({
		url: url,
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': token
		},
		body: JSON.stringify({
			date: date,
			text: text
		})
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(null, body);
		} else {
			if (error)
				callback(error, null);
			else
				callback(new Error("READAPI Returned status code " + response.statusCode), null);
		}
	});
}

function callUpdateAPI(token, id, text, date, callback) {
	var updateUrl = constants.rMindURL + 'api/memos/' + id;

	request({
		url: updateUrl,
		method: "PUT",
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': token
		},
		body: JSON.stringify({
			text: text,
			date: date			
		})
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(null, body);
		} else {
			if (error)
				callback(error, null);
			else
				callback(new Error("UPDATEAPI Returned status code " + response.statusCode), null);
		}
	});
}

function callDeleteAPI(token, id, callback) {
	var removeUrl = constants.rMindURL + 'api/memos/' + id;

	request({
		url: removeUrl,
		method: "DELETE",
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': token
		}
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(null, body);
		} else {
			if (error)
				callback(error, null);
			else
				callback(new Error("DELETEAPI Returned status code " + response.statusCode), null);
		}
	});
}

function callDeleteAllAPIrec(token, i, len, memos, callback) {
	callDeleteAPI(token, memos[i]._id, function (error, result) {
		if (!error) {
			if (i + 1 < len)
				callDeleteAllAPIrec(token, i + 1, len, memos, callback);
			else
				callback(null, JSON.stringify(memos));
		} else 
			callback(error, null);
	});
}

function callDeleteAllAPI(token, memos, callback) {
	if(memos && memos.length > 0)
		callDeleteAllAPIrec(token, 0, memos.length, memos, callback);
	else 
		callback(null, JSON.stringify([]));
}

function callUpdateAllAPIrec(token, i, len, memos, text, date, callback) {
	callUpdateAPI(token, memos[i]._id, text, date, function (error, result) {
		if (!error) {
			memos[i] = result;
			if (i + 1 < len)
				callUpdateAllAPIrec(token, i + 1, len, memos, text, date, callback);
			else
				callback(null, JSON.stringify(memos));
		} else 
			callback(error, null);
	});
}

function callUpdateAllAPI(token, memos, text, date, callback) {
	if(memos && memos.length > 0)
		callUpdateAllAPIrec(token, 0, memos.length, memos, text, date, callback);
	else 
		callback(null, JSON.stringify([]));
}

router.post('/', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	
	var contexts = req.body.result.contexts;

	var token = null;
	for (var i = 0, len = contexts.length; i < len && token === null; i++) {
		if (contexts[i].name === 'auth')
			token = contexts[i].parameters.token;
	}

	if (token === null) {
		return res.status(403).send({
			error: true,
			message: 'No token provided.'
		});
	}

	jwt.verify(token, constants.tokenSecret, function (err, decoded) {
		if (err) {
			return res.status(403).send({
				error: true,
				message: 'Failed to authenticate token.'
			});
		}

		var userId = decoded.id;
		var action = req.body.result.action;
		var parameters = req.body.result.parameters;

		if (action === 'reminders.add') {
			callCreateAPI(token, parameters['name'], parameters['date-time'], function (error, result) {
				if (!error) {
					var text = 'Done!';
					
					return res.status(200).send({
						'speech': text,
						'displayText': text,
						'data': result
					});
				} else {
					console.log(error);
					return res.status(500).send({
						error: true,
						message: 'Bad api request.',
						inner: error
					});
				}
			});
		} else if (action === 'reminders.get' ||
			action === 'reminders.get.past' ||
			action === 'reminders.remove' ||
			action === 'reminders.rename' ||
			action === 'reminders.reschedule') {

			callReadAPI(token, (action === 'reminders.rename' ? parameters['old-name'] :  parameters['name']), parameters['date-time'], function (error, result) {
				if (!error) {
					if (action === 'reminders.remove') {
						var i = 0;
						var memos = JSON.parse(result);
						callDeleteAllAPI(token, memos, function (error, result) {
							if (!error) {
								if (memos.length > 0)
									text = 'Deleted '+memos.length + " reminders!";
								else
									text = 'Nothing to delete!';

								return res.status(200).send({
									'speech': text,
									'displayText': text,
									'data': result
								});
							} else {
								console.log(error);
								return res.status(500).send({
									error: true,
									message: 'Bad api request.',
									inner: error
								});
							}
						})
					} else if (action === 'reminders.rename') {
						var i = 0;
						var memos = JSON.parse(result);
						callUpdateAllAPI(token, memos, parameters['name'], null, function (error, result) {
							if (!error) {
								if (memos.length > 0)
									text = 'Updated '+memos.length + " reminders!";
								else
									text = 'Nothing to update!';

								return res.status(200).send({
									'speech': text,
									'displayText': text,
									'data': result
								});
							} else {
								console.log(error);
								return res.status(500).send({
									error: true,
									message: 'Bad api request.',
									inner: error
								});
							}
						})
					} else if (action === 'reminders.reschedule') {
						var i = 0;
						var memos = JSON.parse(result);
						callUpdateAllAPI(token, memos, null, parameters['date-time-new'], function (error, result) {
							if (!error) {
								if (memos.length > 0)
									text = 'Updated '+memos.length + " reminders!";
								else
									text = 'Nothing to update!';

								return res.status(200).send({
									'speech': text,
									'displayText': text,
									'data': result
								});
							} else {
								console.log(error);
								return res.status(500).send({
									error: true,
									message: 'Bad api request.',
									inner: error
								});
							}
						})
					} else {
						var text;
						var memos = JSON.parse(result);

						if (memos.length > 0)
							text = 'And that\'s all!';
						else
							text = 'Nothing to show! (for now..)'

						return res.status(200).send({
							'speech': text,
							'displayText': text,
							'data': result
						});
					}
				} else {
					console.log(error);
					return res.status(500).send({
						error: true,
						message: 'Bad api request.',
						inner: error
					});
				}
			});
		}
	});
});

module.exports = router;
