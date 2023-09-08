const mongoose = require("mongoose");
const Address = require("../models/Address"); // Import the Address model
const { StatusCodes } = require("http-status-codes");

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    // get the address details from req.body
    const { line1, city, state, postalCode } = req.body;

    // check all fields are filled
    if (!line1 || !city || !state || !postalCode) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please enter all details in data field",
      });
    }

    // create the address
    const createdAddress = await new Address({
      line1,
      city,
      state,
      postalCode,
    });

    // save to database
    const newAddress = await createdAddress.save();

    // send success message
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully created an address",
      address: newAddress,
    });
  } catch (error) {
    // send error message
    console.log("Error from Address Controller while creating an address");
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
    const { addressId } = req.params;

    //get the address details from req.body
    const { line1, city, state, postalCode } = req.body;

    // Find the address by its ID and update its properties
    const updatedAddress = await Category.findByIdAndUpdate(
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get an address by ID
exports.findAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findById(addressId);

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
    const addressId = req.params.id;

    // Check if the address exits or not
    const address = await Address.findById(addressId);
    if (!address) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "There does not exist a product with this id",
      });
    }

    // Delete the existing address from database
    await address.remove();

    // Return response
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to delete address" });
  }
};
