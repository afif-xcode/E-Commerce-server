const Product = require("../models/Product");
const Category = require("../models/Category");
const { StatusCodes } = require("http-status-codes");
const { imageUploadToCloudinary, imageDeleteFromCloudinary } = require("../utils/imageUploader");
require('dotenv').config();

// Create a product
exports.createProduct = async (req, res) => {
  try {
    // Get all data
    const { productName, description, price, category, tag } = req.body;
    const thumbnail = req.files.thumbnailImage
    // validate data
    if (
      !productName ||
      !description ||
      !price ||
      !category ||
      !tag ||
      !thumbnail
    ) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check for category
    const isCategoryPresent = await Category.findById(category);
    if (!isCategoryPresent) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        messag: "Category not found",
      });
    }
    // upload thumbnail to cloudinary
    const file = `${process.env.FOLDER_NAME}/ProductImage`;
    const thumbnailImageLink = await imageUploadToCloudinary(
      thumbnail,
      file
    );
    console.log(thumbnailImageLink);
    const thumbnailImage = {
      public_id : thumbnailImageLink.public_id,
      image_link : thumbnailImageLink.secure_url,
    }
    // create product on db
    const productDetails = await Product.create({
      productName,
      description,
      price,
      thumbnail: thumbnailImage,
      category,
      tag,
    });

    // insert product id on category model
    const categoryDetails = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          products: productDetails._id,
        },
      },
      { new: true }
    );
    // return responce
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Product Created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while creating product",
    });
  }
};

// Edit a product or update details of product
exports.editProductDetails = async (req, res) => {
  try {
    //get the product id from the params
    //get the details of the product to be updated
    const {prodID, productName, description, price, category, tag } = req.body;
    const thumbnail = req.files.thumbnailImage
    //validate the data of the products

    if (!productName || !description || !price || !category || !tag) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check if the product exits or not
    const existingProduct = await Product.findById(prodID);
    if (!existingProduct) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "This product does not exist",
      });
    }

    //now update the details
    existingProduct.productName = productName;
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.category = category;
    existingProduct.tag = tag;

    if(thumbnail) {
      // delete old thumbanil and upload new thumbnail on cloudinary
      const result = await imageDeleteFromCloudinary(existingProduct.thumbnail.public_id);
      console.log('Image deleted successfully');
      // upload thumbnail to cloudinary
      const file = `${process.env.FOLDER_NAME}/ProductImage`;
      const thumbnailImageLink = await imageUploadToCloudinary(
        thumbnail,
        file
      );
      console.log(thumbnailImageLink);
      const thumbnailImage = {
        public_id : thumbnailImageLink.public_id,
        image_link : thumbnailImageLink.secure_url,
      }
      existingProduct.thumbnail = thumbnailImage;
    } 

    //save the updated product
    const updatedProduct = await existingProduct.save();

    //now return the successfully updated message
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully Updated product details",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while updating a product",
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    // Get the product id to delete it
    const {prodID} = req.body;
    // Check if the product exits or not
    const existingProduct = await Product.findById(prodID);
    if (!existingProduct) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "There does not exist a product with this id",
      });
    }

    // before deleting form db delete image from cloudinary
    const result = await imageDeleteFromCloudinary(existingProduct.thumbnail.public_id);
    console.log("Image deleted successfully");

    const categoryDetails = await Category.findByIdAndUpdate(
      { _id: existingProduct.category },
      {
        $pull: {
          products: existingProduct._id,
        },
      },
      { new: true }
    );


    // Delete the existing product from database
    const deletedProduct = await Product.findByIdAndDelete(prodID);

    // Return response
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while deleting the product",
    });
  }
};

// Get All product
exports.getAllProduct = async (req, res) => {
  try {
    // Fetch all the products from the database
    const existingProducts = await Product.find({}).populate('category');
    if (!existingProducts) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No Products Found",
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Found All the products",
      products: existingProducts,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error while getting products",
    });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    // Get the id from the params
    const {productID} = req.body;

    // Find the existing product by its id in database
    const getexistingProduct = await Product.findById(productID).populate('category');

    //check if there exists a product with this id
    if (!getexistingProduct) {
      //send not found
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No Product found with this id",
      });
    }

    //send success message
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Successfully Found the product",
      product: getexistingProduct,
    });
  } catch (error) {
    console.log("Error from the get product by id controller");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error while getting a single product",
    });
  }
};

