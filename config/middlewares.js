var jwt = require('jsonwebtoken');
var config = require('./constants');

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
	if(!token)
		token = req.query.token;
	if(!token)
		token = req.body.token;
	if(!token)
		token = req.param.token;

  if (!token)
    return res.status(403).send({ error: true, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    	return res.status(500).send({ error: true, message: 'Failed to authenticate token.' });

    req.userId = decoded.id;
    next();
  });
}

module.exports.verifyToken = verifyToken;
