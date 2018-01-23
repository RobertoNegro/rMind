var debug = require('debug')('rmind:webhook');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
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
		sessionId: req.headers['x-access-token']
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
			 	res.status(500).send({ error: true, message: 'Something failed in DialogFlow', inner: error });
		}
	}

	request(options, callback);
});

router.post('/', function (req, res) {
	jwt.verify(req.body.sessionId, constants.tokenSecret, function(err, decoded) {
    if (err) 
    	return res.status(500).send({ error: true, message: 'Failed to authenticate token.' });

    var userId = decoded.id;
		var action = req.body.result.action;
		var parameters = req.body.result.parameters;
		
		console.log("User ID: ");
		console.log(userId);
		console.log("Action: ");    
		console.log(action);
		console.log("Parameters: ");
		console.log(parameters);
		
		var text = 'this is a reply for '+userId;
		res.status(200).send({
			'speech': text,
			'displayText': text
		});
  });
});

module.exports = router;


/* Typical POST webhook request from dialogflow to heroku
2018-01-11T15:59:35.045935+00:00 app[web.1]: { id: 'be6b02fd-f06d-48cf-a7c7-bee82a8e8a5f',
2018-01-11T15:59:35.045935+00:00 app[web.1]:   timestamp: '2018-01-11T15:59:34.867Z',
2018-01-11T15:59:35.045937+00:00 app[web.1]:   lang: 'en',
2018-01-11T15:59:35.045938+00:00 app[web.1]:   result:
2018-01-11T15:59:35.045939+00:00 app[web.1]:    { source: 'agent',
2018-01-11T15:59:35.045940+00:00 app[web.1]:      resolvedQuery: 'remind me tomorrow to call john',
2018-01-11T15:59:35.045941+00:00 app[web.1]:      speech: '',
2018-01-11T15:59:35.045942+00:00 app[web.1]:      action: 'reminders.add',
2018-01-11T15:59:35.045944+00:00 app[web.1]:      actionIncomplete: false,
2018-01-11T15:59:35.045945+00:00 app[web.1]:      parameters: { name: 'call john', recurrence: '', 'date-time': '2018-01-12' },
2018-01-11T15:59:35.045946+00:00 app[web.1]:      contexts: [ [Object] ],
2018-01-11T15:59:35.045947+00:00 app[web.1]:      metadata:
2018-01-11T15:59:35.045948+00:00 app[web.1]:       { intentId: 'bfdfafa6-9302-412b-9e6b-5b3d8a966735',
2018-01-11T15:59:35.045949+00:00 app[web.1]:         webhookUsed: 'true',
2018-01-11T15:59:35.045950+00:00 app[web.1]:         webhookForSlotFillingUsed: 'false',
2018-01-11T15:59:35.045951+00:00 app[web.1]:         intentName: 'reminders.add' },
2018-01-11T15:59:35.045952+00:00 app[web.1]:      fulfillment:
2018-01-11T15:59:35.045953+00:00 app[web.1]:       { speech: 'I\'m so sorry! An error has occured and I\'ve forgot what you\'ve said.. Can you repeat, please?',
2018-01-11T15:59:35.045955+00:00 app[web.1]:         messages: [Array] },
2018-01-11T15:59:35.045956+00:00 app[web.1]:      score: 1 },
2018-01-11T15:59:35.045957+00:00 app[web.1]:   status: { code: 200, errorType: 'success', webhookTimedOut: false },
2018-01-11T15:59:35.045958+00:00 app[web.1]:   sessionId: '12345' }
*/