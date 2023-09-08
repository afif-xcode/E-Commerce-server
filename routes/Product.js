const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProduct,
  getProductById,
  editProductDetails,
  deleteProduct,
} = require("../controllers/Product");
const { auth, isAdmin } = require("../middlewares/auth");

router.post('/createproduct', auth, isAdmin, createProduct);
router.post('/editproduct', auth, isAdmin, editProductDetails);
router.delete('/deleteproduct', auth, isAdmin, deleteProduct);
router.get('/getallproduct', getAllProduct);
router.get('/getproductbyid', getProductById);

module.exports = router;
