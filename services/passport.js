const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config'); // 重要金鑰

// Create JWT strategy ( strategy #1 ) => '/'
//setup options for jwt strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'), // token
	secretOrKey: config.secret
}

// create jwt strategy
// payload is decoded JWT token!!!!!
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// payload = { sub: user.id, iat: timestamp }
	// if userid existed, ok you can comming in (done + user)

	User.findById(payload.sub, function(err, user) {
		if (err) return done(err, false);
		if (user) return done(null, false);

		return done(null, user);
	})
});

// Create local strategy ( strategy #2 ) => '/signin'
// Change default parameter name => http://www.passportjs.org/docs/username-password/
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

	// verify this email and password
	User.findOne({ email: email }, function(err, user) {
		if (err) return done(err);
		if (!user) return done(null, false); //can not find the user

		// compare password with database
		user.comparePassword(password, function(err, isMatch) {
			if (err) return done(err);
			if (!isMatch) return done(null, false);

			return done(null, user); // user send to next res => res.user
		})
	})
})

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);