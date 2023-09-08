const express = require("express");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const Category = require("../models/Category");

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    // Take the category details
    const { categoryName, description } = req.body;

    // check if all the fields are there
    if (!categoryName || !description) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please make sure all fields are filled.",
      });
    }

    const newCategory = new Category({
      categoryName,
      description,
    });

    const savedCategory = await newCategory.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully created a category",
      savedCategory: savedCategory,
    });
  } catch (error) {
    console.log("Error While creating a category!!");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Edit a category
exports.editCategory = async (req, res) => {
  try {
    // get the category id from req.params
    const { categoryId } = req.body;

    //get the category details from req.body
    const { categoryName, description } = req.body;

    // Find the category by its ID and update its properties
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        categoryName,
        description,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log("Error while editing a category");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Show all category
exports.showAllCategories = async(req, res) => {
  try {
    // fetch all categories from db
    const allCategories = await Category.find().populate('products');
    res.status(StatusCodes.OK).json(
      {
        success : true,
        message : "All Categories fetch successfully",
        data : allCategories,
      }
    )
  }catch(error) {
    console.log("Error while show all category");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// Show category page details
exports.categoryPageDetails = async(req,res) => {
  try {
    const {categoryId} = req.body;
    // get products for the specified category
    const selectedCategory = await Category.findById(categoryId).populate({
      path: "products",
    });

    // Handle the error were category does not found
    if(!selectedCategory) {
      return res.status(StatusCodes.NOT_FOUND).json(
        {
          success : false,
          message : "Category not found"
        }
      )
    }
    // Handle the error were category product array is length === 0
    if(selectedCategory.products.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json(
        {
          success : false,
          message : "No product found for the selected category"
        }
      )
    }
    // Get all course for other categories
    const categoriesProductsExpectSelected = await Category.find({
      id: {$ne : categoryId}
    });
    let differentCategory = await Category.findOne(
      categoriesProductsExpectSelected[getRandomInt(categoriesProductsExpectSelected.length)]
        ._id
    ).populate('products')
    .exec();

    return res.status(StatusCodes.OK).json(
      {
        success : true,
        message : "Categories data fetch successfully",
        data : {
          selectedCategory,
          differentCategory,
        }
      }
    )
  }catch(error) {
    console.log(error);
  }
}
