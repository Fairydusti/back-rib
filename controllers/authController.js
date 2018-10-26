const mongoose = require('mongoose')
const Auth = mongoose.model('Auth')
const promisify = require('es6-promisify')
mongoose.Promise = global.Promise;

const { createUserJWT, verifyUserCredentials } = require('./../handlers/authenticationHandlers')

exports.loginUser =  (req, res, next) => {
   res.json(req.user)
};

exports.getSecureContent = (req, res, next) => {
   res.json({secure: 'This is very secure content'})
}
exports.createAccount = async (req, res, next) => {
   const authCredentials = await new Auth(req.body ).save();
   res.json({success: true, daa: authtCredentials, token: createUserJWT(authCredentials)})
}

exports.validateRegister = async (req, res, next) => {
   req.sanitizeBody('username');
   req.checkBody('username', 'Username can not be empty 🤦').notEmpty();
   req.checkBody('email', 'Email can not be empty 🤦').notEmpty();
   req.checkBody('email', 'Email is not valid 🤦').isEmail();
   req.sanitizeBody('email').normalizeEmail({
      remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddresses:false,
   });
   req.checkBody('password', 'U moron! Password can not be blanco 🤦').notEmpty();
   const errorsInRegistration = req.validationErrors();
   
   if(errorsInRegistration){
      res.status(401).send({
         success: false, 
         errors: errorsInRegistration
      });
      return
   }
   const userExists = await Auth.findOne({email: req.body.email});
   if(userExists){
      console.log('User exists')
      res.status(422).send({success: false, error: 'Email is already in use'});
      return;
   }
   next();
}