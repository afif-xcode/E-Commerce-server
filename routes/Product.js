const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProduct,
  getProductById,
  editProductDetails,
  deleteProduct,
} = require("../controllers/Product");
const { auth, isAdmin, isCustomer } = require("../middlewares/auth");

const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require('../controllers/RatingAndReview')

router.post('/createProduct', auth, isAdmin, createProduct);
router.post('/editProduct', auth, isAdmin, editProductDetails);
router.delete('/deleteProduct', auth, isAdmin, deleteProduct);
router.get('/getAllProduct', getAllProduct);
router.get('/getProductById', getProductById);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isCustomer, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingReview)

module.exports = router;
