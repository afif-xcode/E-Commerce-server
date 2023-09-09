const Profile = require("../models/Profile")
const User = require("../models/User")
const { imageUploadToCloudinary, imageDeleteFromCloudinary} = require("../utils/imageUploader")
const mongoose = require("mongoose")

// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      contactNumber = "",
      gender = "",
    } = req.body
    const id = req.user.id

    // Find the profile by id
    const userDetails = await User.findById(id)
    const profile = await Profile.findById(userDetails.additionalDetails)

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    })
    await user.save()

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth
    profile.contactNumber = contactNumber
    profile.gender = gender

    // Save the updated profile
    await profile.save()

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate([{path: 'additionalDetails'}, {path: 'address'}, {path : 'orders'}])
      .exec()
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    console.log('ERROR FROM GET USER DETAILS')
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    // fetch all data
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const userDetails = await User.findById(userId);
    // before upload we need to delete previous image
    const result = await imageDeleteFromCloudinary(userDetails.image.public_id);
    console.log(result);
    console.log("Image deleted successfully");

    // upload image to cloudinary 
    const file = `${process.env.FOLDER_NAME}/ProfileImages`;
    const imageLink = await imageUploadToCloudinary(
      displayPicture,
      file,
      1000,
      1000
    )
    console.log(imageLink)
    const image = {
      public_id : imageLink.public_id,
      image_link : imageLink.secure_url
    }
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image},
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    console.log("ERROR FROM PROFILE IMAGE UPDATE");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
