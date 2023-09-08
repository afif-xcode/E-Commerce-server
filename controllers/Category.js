const express = require("express");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const Category = require("../models/Category");
const { json } = require("express");

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
      products,
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
    const { categoryId } = req.params;

    //get the category details from req.body
    const { categoryName, description, products } = req.body;

    // Find the category by its ID and update its properties
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        categoryName,
        description,
        products,
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

// Show category details
