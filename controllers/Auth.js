const User = require("../models/User");
const Profile = require("../models/Profile");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Address = require("../models/Address");

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
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: "All fields are require",
      });
    }
    // password and confirmPassword is same or not
    if (password != confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: "Password and Confirm Password did not match",
      });
    }
    // check user already present or not
    const isExitUser = await User.findOne({ email });
    if (isExitUser) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        success: false,
        message: "User Already exist",
      });
    }

    // Find otp and check it is same or not
    const responce = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (responce.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== responce[0].otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

        // password hashed and save it in variable
        const hashedPassword = await bcrypt.hash(password, 10);
       
        // create additional details and add it
        const profileDetails = await Profile.create(
            {
                gender : null,
                dateOfBirth: null,
                contactNumber: null
            }
        )
        // Create the user
        const image = {
            public_id : firstName,
            image_link : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`
        }
        const user = await User.create(
            {
                firstName,
                lastName,
                email,
                password : hashedPassword,
                role,
                additionalDetails : profileDetails._id,
                image: image,
            }
        )

    // return responce
    return res.status(StatusCodes.CREATED).json({
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

// login 
exports.login = async (req, res) => {
  try {
    // Get email and password from req body
    const { email, password } = req.body;
    // validate data
    if (!email || !password) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "All fields are require",
      });
    }
    // user present or not
    const isPresentUser = await User.findOne({ email }).populate(
      "additionalDetails"
    );
    if (!isPresentUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found, Create you account first",
      });
    }
    // password check
    const checkPasswordSameORnot = await bcrypt.compare(
      password,
      isPresentUser.password
    );
    if (!checkPasswordSameORnot) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Incorrect Password",
      });
    }
    // create JWT token and store it
    const token = jwt.sign(
      {
        email: isPresentUser.email,
        id: isPresentUser._id,
        role: isPresentUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    (isPresentUser.token = token), (isPresentUser.password = undefined);

    // save token on cookies and send responce
    const option = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, option).status(StatusCodes.OK).json({
      success: true,
      token,
      isPresentUser,
      message: "Login Successfully",
    });
  } catch (error) {
    console.log("ERROR FROM CONTROLLER AUTH LOGIN");
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while user login",
    });
  }
};

// send otp to email
exports.sendOtp = async (req, res) => {
  try {
    // fetch email from body
    const { email } = req.body;

    // generate otp
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // first check the otp is unique or not
    const result = await OTP.findOne({ otp: otp });
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

// change password of user
exports.changePassword = async (req, res) => {
  try {
    // fetch user data from req.user
    const userDetails = await User.findById(req.user.id);
    // get old password and new password from req.body
    const { oldPassword, newPassword } = req.body;
    // validate data
    if (!oldPassword || !newPassword) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "All fields are require",
      });
    }
    // check old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Wrong old password",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(StatusCodes.NOT_MODIFIED).json({
        success: false,
        message: "Old password and New password is same",
      });
    }

    // Update password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true }
    ).populate("additionalDetails");

    // send mail to user
    try {
      const emailResponce = await mailSender(
        updatedUserDetails.email,
        "Password for you account has been updated",
        "Passwrod Updated"
      );
    } catch (error) {}

    // send responce
    return res.status(StatusCodes.OK).json({
      success: true,
      updatedUserDetails,
      message: "Password Changed",
    });
  } catch (error) {
    console.log("ERROR FROM CONTROLLER AUTH CHANGE PASSWORD");
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while changing password",
    });
  }
};

// // show all addresses of an user
// exports.getAllAddressesOfUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId).populate("Address");

//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Fetched all addresses of a single user",
//       address: [user.addresses],
//     });
//   } catch (error) {
//     console.log(
//       "Error from Auth controller while fetching all address of single user"
//     );
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to retrieve user addresses",
//     });
//   }
// };
