const RatingAndReview = require("../models/RatingAndReview")
const Product = require("../models/Product");
const Order = require("../models/Orders")
const mongoose = require("mongoose")
const {StatusCodes} = require('http-status-codes');

//function for checking product is reviewd or not 
function checkbuy(product, arr) {
  return arr.some(function(index) {
    return index.product.toString() === product;
  }); 
}

// Create a new rating and review
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id
    const { rating, review, productId } = req.body

    // Check if the user is buyed the product or not
    const userOrders = await Order.find({user: userId});
    let check = false;
    for(let i = 0; i < userOrders.length; i++) {
      if(checkbuy(productId, userOrders[i].products)) {
        check = true;
        break;
      }
    }

    if(check == false) {
      return res.status(StatusCodes.NOT_FOUND).json(
        {
          success : false,
          message : "User Not yet buyed this course"
        }
      )
    }

    // Check if the user has already reviewed the product
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      product: productId,
    })
    
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Product already reviewed by user",
      })
    }
    
    // Create a new rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      product: productId,
      user: userId,
    })

    // Add the rating and review to the product
    await Product.findByIdAndUpdate(productId, {
      $push: {
        ratingAndReview: ratingReview,
      },
    })

    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Get the average rating for a course
exports.getAverageRating = async (req, res) => {
  try {
    const productId = req.body.productId

    // Calculate the average rating using the MongoDB aggregation pipeline
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId), // Convert courseId to ObjectId
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ])

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      })
    }

    // If no ratings are found, return 0 as the default rating
    return res.status(200).json({ success: true, averageRating: 0 })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating for the product",
      error: error.message,
    })
  }
}

// Get all rating and reviews
exports.getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image", // Specify the fields you want to populate from the "Profile" model
      })
      .populate({
        path: "product",
        select: "productName", //Specify the fields you want to populate from the "Product" model
      })
      .exec()

    res.status(200).json({
      success: true,
      data: allReviews,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating and review for the course",
      error: error.message,
    })
  }
}
