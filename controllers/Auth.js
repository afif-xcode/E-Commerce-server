const user = require("../models/User.js");

const Profile = require("../models/Profile.js");

const OTP = require("../models/OTP.js");

const bcrypt = require("bcrypt");

const otpGenerator = require("otp-generator");

// Sign up
exports.signup = async (req, res) => {
  try {
    // Fetch all data req.body
    const { firstName, lastName, email, password, confirmPassword, role, otp } =
      req.body;
    // Validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !otp
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are require",
      });
    }
    // password and confirmPassword is same or not
    if (password !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password and Confirm Password did not match",
      });
    }
    // check user already present or not
    const isExistingUser = await User.findOne({ email });
    if (!isExistingUser) {
      return res.status(401).send({
        success: false,
        message: "User Already exist",
      });
    }

    // Find otp and check it is same or not
    const responce = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (responce.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== responce[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    // password hashed and save it in variable
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create additional details and add it
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      contactNumber: null,
    });

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    // return responce
    return res.status(201).json({
      success: true,
      data: user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("ERROR FROM CONTROLLER AUTH SIGNUP");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating user",
    });
  }
};

//Send OTP
exports.sendOtp = async (req, res) => {
  try {
    // fetch email from body
    const { email } = req.body;

    // generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // first check the otp is unique or not
    const result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    // insert otp on OTP model
    const otpResult = await OTP.create({
      email,
      otp,
    });

    res.status(200).json({
      success: true,
      message: "OTP Send Successfully",
    });
  } catch (error) {
    console.log("ERROR FROM CONTROLLER AUTH SENDOTP");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending otp",
    });
  }
};
