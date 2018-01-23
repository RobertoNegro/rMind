var debug = require('debug')('rmind:webhook');
var express = require('express');

var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

router.post('/', function (req, res) {
	console.log('Request: ');
	console.log('-------------------------');
	console.log(req.body);

	var text = 'from webhook, with love';
	res.status(200).send({
		'speech': text,
		'displayText': text
	});
});

module.exports = router;
