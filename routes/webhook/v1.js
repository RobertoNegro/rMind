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

	var body = JSON.stringify({
		lang: 'en',
		query: message,
		sessionId: req.userId,
		contexts: [
			{
				name: 'auth',
				lifespan: 1,
				parameters: {
					token: req.headers['x-access-token']
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

router.post('/', function (req, res) {
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
		
		
		switch (action) {
			case 'reminders.add':
				var url = constants.rMindURL + 'api/memos';
				request({
					url: url,
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': token
					},
					body: JSON.stringify({
						date: parameters['date-time'],
						text: parameters['name']
					})
				}, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						console.log(error);
						console.log(response.statusCode);
						
						var text = 'Done!';
						res.status(200).send({
							'speech': text,
							'displayText': text
						});
					} else {
						console.log(error);
						res.status(500).send({
							error: true,
							message: 'Bad api request.',
							inner: error							
						});
					}
				});
				break;
				
				case 'reminders.get':
				case 'reminders.get.past':
				
				var url = constants.rMindURL + 'api/memos';
				request({
					url: url,
					method: "GET",
					headers: {
						'x-access-token': token
					}
				}, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						var text = 'Done!';
						
						res.status(200).send({
							'speech': text,
							'displayText': text,
							'data' : body
						});
					} else {
						console.log(error);
						res.status(500).send({
							error: true,
							message: 'Bad api request.',
							inner: error							
						});
					}
				});
				break;
				
				case 'reminders.remove':
				break;
				
				case 'reminders.rename':
				break;
				
				case 'reminders.reschedule':
				break;
		}


	});
});

module.exports = router;
