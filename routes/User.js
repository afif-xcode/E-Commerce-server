// Import the require modules
const express = require('express');
const router = express.Router();

// Import the required controllers and middleware funtions
const {
    login,
    signup,
    sendOtp,
    changePassword
} = require('../controllers/Auth');

const {
    auth
} = require('../middlewares/auth');


// Routes for Login , SignUp and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route for send otp to the user email
router.post('/sendotp', sendOtp);

// Route for change password
router.post('/changepassword', auth, changePassword);




module.exports = router