const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret); // sub is short for subject, that is who does this belong to
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  // passport sends us this user back with done
  // ie passes the request onto the next middleware on the req with the prop user
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must return an email and password' });
  }

  // see if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    // if there was an error, return the next route with the err
    if (err) { return next(err); }

    // if a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // if a user with email does not exist, create and save user record
    // note just creates the user in memory.  This is linked to our database by default some how
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err) };

      // respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}
