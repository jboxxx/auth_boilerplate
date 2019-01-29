const Authentication = require('./controllers/authentication');
const JwtPassportService = require('./services/passport').jwtLogin;
const LocalPassportService = require('./services/passport').localLogin;
const requireAuth = JwtPassportService.authenticate('jwt', {session: false});
const requireSignIn = LocalPassportService.authenticate('local', {session: false});


// or alternatively
// const passportService = require('./services/passport');
// const passport = require('passport');

// const requireAuth = passport.authenticate('jwt', {session: false});
// const requireSignIn = passportService.authenticate('local', {session: false});

module.exports = function(app) {
  // req is the incoming http request
  // res is the response we are allowed to create
  // next is most for error handling.
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  app.post('/signin', requireSignIn, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
