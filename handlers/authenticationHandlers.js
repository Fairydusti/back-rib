const bcrypt = require('bcrypt');
const jwtSimple = require('jwt-simple');
const saltRounds = 10;
// Encryption function
exports.createBcryptedPassword = function(next){
   // Get access to model / credentials
   const credentials = this;
   // Generate salt
   bcrypt.genSalt(saltRounds, function(err, salt){
      if(err) { return next(err) }
      
      // Generate hash from the generated salt and password
      bcrypt.hash(credentials.password, salt, function(err, hash){
         if(err) { return next(err) };

         // Overwite unsecure password in new secure one
         credentials.password = hash;
         next();
      });
   })
};
exports.verifyUserCredentials = async (userCredential, hashedCredential) => {
      const match = await bcrypt.compare(userCredential, hashedCredential);
      console.log('match in handler: ', match)
      if(match)
         return true;
      return false;
      Error("Error 🚫🚫🚫", error)
}

exports.createUserJWT = (userCredentials) => {
   const timestamp = new Date().getTime();
   return  jwtSimple.encode({sub: userCredentials.id, iat: timestamp}, process.env.SECRET)
}