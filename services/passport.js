const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// request comes in, handled to passport, passport sends to Jwt Strategy
// A Strategy is method for authenticating a user
// Strategy 1: Verify with a JWT
// Strategy 2: Verify a user with a username and password

// Create local strategy for signing in with username and password
// expects there to be a username field, but we are pointing to the email property as the username
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, call done with the user
  // if it the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare passwords - is `password` equal to user.password?  user.password is hashed
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
      // passes back the user to the callback, ie the next function that will be called
      // passes this on the request object with req.user
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy to test if a token is authenticated
// payload is decoded jwt token (sub: userId and iat: timestamp)
// done is what we want to call after we've authenticated, ie continuing node middleware callbacks
// we pass done with the user if we can find it. else we pass without a user object
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user); // we found a user
    } else {
      done(null, false); // we didn't find a user, but search didn't fail
    }
  });
});

// Tell passport to use this strategy
exports.jwtLogin = passport.use(jwtLogin);
exports.localLogin = passport.use(localLogin);

// or alternatively
// passport.use(jwtLogin);
// passport.use(localLogin);
