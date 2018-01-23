var jwt = require('jsonwebtoken');
var constants = require('./constants');

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
	if(!token)
		token = req.query.token;
	if(!token)
		token = req.body.token;
	if(!token)
		token = req.param.token;
	
	token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhNTc4NzhmZTJmM2YwMDAxNDRhMGI0NSIsImlhdCI6MTUxNTc2ODAyNywiZXhwIjoxNTE1ODU0NDI3fQ.jR50iIZG6kCaxYinQu69hjouLq87BGcMRQ_HS_dB-tA';
	
  if (!token)
    return res.status(403).send({ error: true, message: 'No token provided.' });

  jwt.verify(token, constants.tokenSecret, function(err, decoded) {
    if (err)
    	return res.status(403).send({ error: true, message: 'Failed to authenticate token.' });

    req.userId = decoded.id;
    next();
  });
}

module.exports.verifyToken = verifyToken;
