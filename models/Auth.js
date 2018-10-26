const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validator = require('validator');
const passportLocalMongoose =  require('passport-local-mongoose')
const Promise = require('es6-promise');
const { createBcryptedPassword,  verifyUserCredentials} = require('./../handlers/authenticationHandlers');

mongoose.Promise = global.Promise;

const authSchema = new Schema({
   email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Invalid Email'],
      required: 'Please add Email',
   },
   username: {
      type: String,
      unique: true,
      lowercase: true,
      required: 'Please add username',
      trim: true,
   },
   password: {
      type: String,
   },
   resetPasswordToken: String,
   resetPasswordExpired: Date,
   role: String
});


// Before new user model get saved, encrypt the password
authSchema.pre('save', createBcryptedPassword);

authSchema.methods.comparePasswords = function(candidatePassword, callback){
   verifyUserCredentials(candidatePassword, this.password).then( (isMatch) => {
      // If not match
      if(!isMatch){ callback({error: 'Login failed. Password not matching'}, isMatch) }
   
      callback(null, isMatch);
   });
}

module.exports = mongoose.model('Auth', authSchema);