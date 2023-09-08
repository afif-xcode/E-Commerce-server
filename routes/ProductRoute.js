const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProduct,
  getProductById,
  editProductDetails,
  deleteProduct,
} = require("../controllers/Product");


router.post('/create', createProduct);
router.post('/editproduct', editProductDetails);
router.post('/deleteproduct', deleteProduct);
router.get('/getallproduct', getAllProduct);
router.get('/getproductbyid', getProductById);

module.exports = router;
