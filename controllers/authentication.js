const jwt = require('jwt-simple');

const User = require('../models/user'); // Schema
const config = require('../config'); // 金鑰

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next) {
	// user has already had the email and password auth's
	// then they need a token
	res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {

	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({error: 'you must provide email and password'});
	}

	// see if user's email exists ?
	User.findOne({email: email}, function(err, existingUser) {

		// if user's email does exist, return err
		if (err) return next(err);
		if (existingUser) return res.status(422).send({error: 'Email is in use'});

		// if user's email doesn't exist, help him to create one
		const user = new User({
			email: email,
			password: password
		})
		user.save(function(err) {
			if (err) return next(err);

			// return token
			res.json({ token: tokenForUser(user) });
		});
	})
	//repond to req indicating the user was created ??
}