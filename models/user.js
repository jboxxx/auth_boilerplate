const mongoose = require('mongoose'); // our ORM to mongodb
const Schema = mongoose.Schema; // Class refering to user
const bcrypt = require('bcrypt-nodejs');

// Define our model which will talk to MongoDB
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook encrypt password
// Before saving a model, run this function (or a 'Hook')
userSchema.pre('save', function(next) {
  const user = this; // getting access to the user model.  Its an instance of the Schema, which has props/methods

  bcrypt.genSalt(10, function(err, salt) { // generate a salt, then run callback
    if (err) { return next(err); }

    // hash / encrypt our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) { // encryption is done. hash continues hashed password and salt
      if (err) { return next(err); }

      user.password = hash; // overwrite plain text password as encrypted password
      next(); // execute all other middleware, ie continue
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema); // represents all users

// Export the model
module.exports = ModelClass;
