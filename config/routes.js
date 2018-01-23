var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

var constants = require('./constants');

// routes
router.use('/', require('../routes/index'));

// api routes v1
router.use('/api/v1/auth', require('../routes/api/v1/auth'));
router.use('/api/v1/memos', require('../routes/api/v1/memos'));
router.use('/api/v1/profile',  require('../routes/api/v1/profile'));

// api routes last version
router.use('/api/auth', require('../routes/api/' + constants.lastAPIVersion + '/auth'));
router.use('/api/memos', require('../routes/api/' + constants.lastAPIVersion + '/memos'));
router.use('/api/profile',  require('../routes/api/' + constants.lastAPIVersion + '/profile'));

// webhook v1
router.use('/webhook/v1', require('../routes/webhook/v1'));

// webhook last version
router.use('/webhook', require('../routes/webhook/' + constants.lastWebhookVersion));

// 404
router.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
router.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.render('error');
});

module.exports = router;
