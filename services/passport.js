const Auth = require('../models/Auth')
const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local');
const { createUserJWT, verifyUserCredentials } = require('./../handlers/authenticationHandlers');


const jwtStrategyOptions = {
   // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
   jwtFromRequest: ExtractJwt.fromHeader('authorization'),
   secretOrKey: process.env.SECRET,
}
// Create JWT strategy for 
const jwtLoginStrategy = new JwtStrategy(jwtStrategyOptions, async (payload, done) => {
   await Auth.findById(payload.sub, (error, authCredentials) => {
      if(error){ // If error occured
         return done(error, false);
      }
      if(authCredentials){ // If credentials are good and no error
         done(null, authCredentials);
      }
      else{ // If credentials cant't be found, but there is no error
         done(null, false)
      }
   })
});

const localStrategyOptions = { usernameField: 'username'};

const localLoginStrategy = new LocalStrategy( localStrategyOptions, async (username, password, done) => {
   const usrname = username.toLowerCase();
   console.log('local')
   await Auth.findOne({username: usrname}, (error, authCredentials) => {
      if(error){ // If error occured
         return done(error, false);
      }
      if(!authCredentials){ // If credentials cant't be found, but there is no error
         return done(null, false)
      }
      console.log('ac:', authCredentials)
      // If credentials are found and no error compare passwords
      authCredentials.comparePasswords(password, (err, isMatch) => {
         if(err){ return(done(err)) }
         if(!isMatch){ return(done(null, isMatch)) }

         return done(null, {credentials: authCredentials.username, token: createUserJWT(authCredentials)});

      })

   });
})
passport.use(jwtLoginStrategy)
passport.use(localLoginStrategy)