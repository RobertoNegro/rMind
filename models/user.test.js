var constants = require('../config/constants');

var db = require('mongoose');
db.connect(constants.dbUrl);

var jest = require('jest');

var user = require('./user');

const testEmail = 'test@test.test';
const testUsername = 'test';
const testPassword = 'testtest';
const testAvatar = 'test.jpg';

const testNewEmail = 'test2@test.test';
const testNewUsername = 'test2';
const testNewPassword = 'testtest2';
const testNewAvatar = 'test2.jpg';

var testId = -1;
test('string validator int', () => {
	expect(user.validString(5)).toBe(false);
});

test('string validator space', () => {
	expect(user.validString('    ')).toBe(false);
});

test('string validator object', () => {
	expect(user.validString({value: 'val'})).toBe(false);
});

test('string validator array', () => {
	expect(user.validString(['value'])).toBe(false);
});

test('string validator undefined', () => {
	expect(user.validString(undefined)).toBe(false);
});

test('string validator null', () => {
	expect(user.validString(null)).toBe(false);
});

test('string validator empty string', () => {
	expect(user.validString('')).toBe(false);
});

test('string validator valid string', () => {
	expect(user.validString('valid')).toBe(true);
});

test('string validator string constructor', () => {
	expect(user.validString(new String('valid'))).toBe(true);
});

test('hash password empty string', done => {
	user.hash('', function (err, hashedPassword) {
		expect(err).toBeDefined();
		expect(hashedPassword).toBeNull();
		done();
	});
});

test('hash password array', done => {
	user.hash(['test'], function (err, hashedPassword) {
		expect(err).toBeDefined();
		expect(hashedPassword).toBeNull();
		done();
	});
});

test('hash password object', done => {
	user.hash({password: 'test'}, function (err, hashedPassword) {
		expect(err).toBeDefined();
		expect(hashedPassword).toBeNull();
		done();
	});
});

test('hash password wrong type (integer)', done => {
	user.hash(5, function (err, hashedPassword) {
		expect(err).toBeDefined();
		expect(hashedPassword).toBeNull();
		done();
	});
});

test('hash password null', done => {
	user.hash(null, function (err, hashedPassword) {
		expect(err).toBeDefined();
		expect(hashedPassword).toBeNull();
		done();
	});
});

test('hash password undefined', done => {
	user.hash(undefined, function (err, hashedPassword) {
		expect(err).toBeDefined();
		expect(hashedPassword).toBeNull();
		done();
	});
});

test('hash password valid', done => {
	user.hash('testtest', function (err, hashedPassword) {
		expect(err).toBeNull();
		expect(hashedPassword).toBeDefined();
		done();
	});
});

test('signup empty string param', done => {
	user.signup('', testUsername, testPassword, testAvatar, function (err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('signup null param', done => {
	user.signup(null, testUsername, testPassword, testAvatar, function (err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('signup undefined param', done => {
	user.signup(undefined, testUsername, testPassword, testAvatar, function (err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('signup wrong type (int) param', done => {
	user.signup(5, testUsername, testPassword, testAvatar, function (err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('signup array param', done => {
	user.signup([testEmail], testUsername, testPassword, testAvatar, function (err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('signup object param', done => {
	user.signup({ email: testEmail }, testUsername, testPassword, testAvatar, function (err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('signup valid without avatar', done => {
	user.signup(testEmail, testUsername, testPassword, null, function (err, res) {
		expect(err).toBeNull();
		expect(res).toBeDefined();
		
		expect(res.username).toEqual(testUsername);
		expect(res.email).toEqual(testEmail);
		expect(res.avatar).toBeUndefined();
						
		user.authenticate(testEmail, testPassword, function(err, res) {
			expect(err).toBeNull();
			expect(res).toBeDefined();

			expect(res.token).toBeDefined();

			expect(res.user.username).toEqual(testUsername);
			expect(res.user.email).toEqual(testEmail);		
			expect(res.user.avatar).toBeUndefined();

			var id = res.user._id;
			user.remove(id.toString(), function(err, res) {
				expect(err).toBeNull();
				expect(res).toBeDefined();

				expect(res['_id']).toEqual(id);
				expect(res.username).toEqual(testUsername);
				expect(res.email).toEqual(testEmail);
				expect(res.avatar).toBeUndefined();

				done();
			});
		})
	});
});

test('signup valid', done => {
	user.signup(testEmail, testUsername, testPassword, testAvatar, function (err, res) {
		expect(err).toBeNull();
		expect(res).toBeDefined();
		
		expect(res.username).toEqual(testUsername);
		expect(res.email).toEqual(testEmail);
		expect(res.avatar).toEqual(testAvatar);
						
		done();
	});
});

test('authenticate empty string param', done => {
	user.authenticate('', testPassword, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('authenticate null param', done => {
	user.authenticate(null, testPassword, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('authenticate undefined param', done => {
	user.authenticate(undefined, testPassword, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('authenticate wrong type (int) param', done => {
	user.authenticate(5, testPassword, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('authenticate array param', done => {
	user.authenticate([testEmail], testPassword, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('authenticate object param', done => {
	user.authenticate({ email: testEmail }, testPassword, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('authenticate inexistent email', done => {
	user.authenticate('inexistent', 'inexistent', function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('authenticate wrong password', done => {
	user.authenticate(testEmail, 'wrong', function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('authenticate valid', done => {
	user.authenticate(testEmail, testPassword, function(err, res) {
		expect(err).toBeNull();
		expect(res).toBeDefined();
		
		expect(res.token).toBeDefined();
		
		expect(res.user.username).toEqual(testUsername);
		expect(res.user.email).toEqual(testEmail);		
		expect(res.user.avatar).toEqual(testAvatar);
		
		testId = res.user._id;
		done();
	})
});

test('read empty string param', done => {
	user.read('', function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();	
		done();
	})
});

test('read array param', done => {
	user.read([testId], function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('read object param', done => {
	user.read({ id: testId }, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('read wrong type (int) param', done => {
	user.read(5, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('read null param', done => {
	user.read(null, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('read undefined param', done => {
	user.read(undefined, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('read inexistent id', done => {
	user.read('-1', function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('read valid', done => {
	user.read(testId.toString(), function(err, res) {
		expect(err).toBeNull();
		expect(res).toBeDefined();
		
		expect(res['_id']).toEqual(testId);
		expect(res.username).toEqual(testUsername);
		expect(res.email).toEqual(testEmail);		
		expect(res.avatar).toEqual(testAvatar);
		
		done();
	})
});

test('change empty string param', done => {
	user.change('', testNewEmail, testNewUsername, testNewPassword, testNewAvatar, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('change array param', done => {
	user.change([testId], testNewEmail, testNewUsername, testNewPassword, testNewAvatar, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('change object param', done => {
	user.change({id : testId}, testNewEmail, testNewUsername, testNewPassword, testNewAvatar, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('change wrong type (int) param', done => {
	user.change(5, testNewEmail, testNewUsername, testNewPassword, testNewAvatar, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('change null param', done => {
	user.change(null, testNewEmail, testNewUsername, testNewPassword, testNewAvatar, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('change undefined param', done => {
	user.change(undefined, testNewEmail, testNewUsername, testNewPassword, testNewAvatar, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('change inexistent id', done => {
	user.change('-1', testNewEmail, testNewUsername, testNewPassword, testNewAvatar, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	})
});

test('change valid but without changes', done => {
	user.change(testId.toString(), null, null, null, null, function(err, res) {
		expect(err).toBeNull();
		expect(res).toBeDefined();
		
		expect(res['_id']).toEqual(testId);
		expect(res.username).toEqual(testUsername);
		expect(res.email).toEqual(testEmail);		
		expect(res.avatar).toEqual(testAvatar);
		
		done();
	})
});

test('change valid', done => {
	user.change(testId.toString(), testNewEmail, testNewUsername, testNewPassword, testNewAvatar, function(err, res) {
		expect(err).toBeNull();
		expect(res).toBeDefined();
		
		expect(res['_id']).toEqual(testId);
		expect(res.username).toEqual(testNewUsername);
		expect(res.email).toEqual(testNewEmail);		
		expect(res.avatar).toEqual(testNewAvatar);
		
		done();
	})
});

test('remove empty string param', done => {
	user.remove('', function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('remove array param', done => {
	user.remove([testId], function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('remove object param', done => {
	user.remove({id: testId}, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('remove null param', done => {
	user.remove(null, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('remove wrong type (int) param', done => {
	user.remove(5, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('remove undefined param', done => {
	user.remove(undefined, function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('remove inexistent id param', done => {
	user.remove('-1', function(err, res) {
		expect(err).toBeDefined();
		expect(res).toBeNull();
		done();
	});
});

test('remove valid', done => {
	user.remove(testId.toString(), function(err, res) {
		expect(err).toBeNull();
		expect(res).toBeDefined();
		
		expect(res['_id']).toEqual(testId);
		expect(res.username).toEqual(testNewUsername);
		expect(res.email).toEqual(testNewEmail);
		expect(res.avatar).toEqual(testNewAvatar);

		done();
	});
});

