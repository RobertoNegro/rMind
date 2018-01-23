var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

var index = require('../routes/index');
var auth = require('../routes/api/auth');
var memos = require('../routes/api/memos');
var profile = require('../routes/api/profile');

// routes
router.use('/', index);

// api routes
router.use('/api/auth', auth);
router.use('/api/memos', memos);
router.use('/api/profile', profile);

// 404
router.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
router.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = router;