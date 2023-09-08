const express = require("express");
const router = express.Router();

const {
    createCategory,
    editCategory,
    showAllCategories,
    categoryPageDetails
} = require('../controllers/Category');

const { auth, isAdmin } = require("../middlewares/auth");


router.post("/createCategory", auth, isAdmin, createCategory)
router.post('/editcategory', auth, isAdmin, editCategory);
router.get("/showAllCategories", showAllCategories)
router.get("/getCategoryPageDetails", categoryPageDetails)


module.exports = router;
