const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const {catchErrors} = require('./../handlers/errorHandlers');
const passportService = require('./../services/passport');
const passport = require('passport');


const requireJwtAuth = passport.authenticate('jwt', {session: false})
const requireLocalAuth = passport.authenticate('local', {session: false})
router.get('/', 
   requireJwtAuth, 
   authController.getSecureContent
);

router.post('/login', 
  requireLocalAuth,
  authController.loginUser
)
router.post('/create', 
   authController.validateRegister,
   catchErrors(authController.createAccount)
)
module.exports = router;