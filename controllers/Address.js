const mongoose = require("mongoose");
const Address = require("../models/Address"); // Import the Address model
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    // get the address details from req.body
    const { line1, city, state, postalCode } = req.body;
    const userId = req.user.id;

    // check all fields are filled
    if (!line1 || !city || !state || !postalCode) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please enter all details in data field",
      });
    }

    // create the address
    const createdAddress = await new Address({
      user : userId,
      line1,
      city,
      state,
      postalCode,
    });

    // save to database
    const newAddress = await createdAddress.save();

    const userDetails = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          address: createdAddress._id,
        },
      },
      { new: true }
    );

    // send success message
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully created an address",
      address: newAddress,
    });
  } catch (error) {
    // send error message
    console.log("Error from Address Controller while creating an address");
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error while creating an address",
      error_message: error,
    });
  }
};

// Update the address
exports.updateAddressById = async (req, res) => {
  try {
    // get the category id from req.params
    const { addressId } = req.body;

    //get the address details from req.body
    const { line1, city, state, postalCode } = req.body;

    // Find the address by its ID and update its properties
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { line1, city, state, postalCode },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Updated the address successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.log("Error while updating address!");
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get an address by ID
exports.getAddressById = async (req, res) => {
  try {
    const { addressId } = req.body;

    const address = await Address.findById(addressId).populate({
      path : 'user',
      populate : 'additionalDetails'
    });

    // Address not found
    if (!address) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Address not found",
      });
    }

    // Address found
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Address found successfully",
      address: address,
    });
  } catch (error) {
    // Internal server error
    console.error("Error while finding address by ID:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete an address by ID
exports.deleteAddressById = async (req, res) => {
  try {
    // Get the address id to delete it
    const {addressId} = req.body;
    const userId = req.user.id;

    // Check if the address exits or not
    const address = await Address.findById(addressId);
    if (!address) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "There does not exist a product with this id",
      });
    }
    // delete address id from user
    const userDetails = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: {
          address: address._id,
        },
      },
      { new: true }
    );

    // Delete the existing address from database
    const deletedAddress = await Address.findByIdAndDelete(address._id);

    // Return response
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to delete address" });
  }
};

// Show all address of perticular user
exports.getAllAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({user : userId});
    if (!addresses) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Not found any addresses",
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Fetched all addresses",
      address: addresses,
    });
  } catch (error) {
    console.log("Error from Address Controller while getting all address!");
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve addresses",
    });
  }
};
