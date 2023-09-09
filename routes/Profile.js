// Import the require modules
const express = require('express');
const router = express.Router();

const {
    updateProfile,
    getUserDetails,
    updateDisplayPicture,
  } = require("../controllers/Profile")

  const {
    auth
} = require('../middlewares/auth');

  // ********************************************************************************************************
  //                                      Profile routes
  // ********************************************************************************************************
    
  router.put("/updateProfile", auth, updateProfile)
  router.get("/getUserDetails", auth, getUserDetails)
  router.put('/updateDisplayPicture', auth, updateDisplayPicture);

  module.exports = router