const passport = require('passport');

const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport'); // let us can provide passport 2 Strategy
// import middleware ==============
// Passport Strategy #1 for Verify token
const requireAuth = passport.authenticate('jwt', { session: false });
// Passport Strategy #2 for Verify username and password
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {

	// home => Verify token (Strategy #1) => return some word
	app.get('/', requireAuth, function(req, res) {
		res.send('The key is correct, the gate of hell is about to open')
	})

	// signIn => verify Email / Password (Strategy #2) => return token for res
	app.post('/signin', requireSignin, Authentication.signin);

	// signUp => verify Email is not in use => return token for res
	app.post('/signup', Authentication.signup);
}