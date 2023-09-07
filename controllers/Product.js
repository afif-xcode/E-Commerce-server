const Product = require('../models/Product');
const Category = require('../models/Category');
const {StatusCodes} = require('http-status-codes');
const {imageUploadToCloudinary} = require('../utils/imageUploader');

// Create a product
exports.createProduct = async(req, res) => {
    try {
        // Get all data
        const {productName,description, price, category, tag} = req.body;
        const thumbnail = req.files.thumbnail;
        // validate data
        if(!productName || !description || !price || !category || !tag || !thumbnail) {
            return res.status(StatusCodes.NOT_FOUND).json(
                {
                    success : false,
                    message : "All fields are required"
                }
            )
        }

        // check for category
        const isCategoryPresent = await Category.findById(category);
        if(!isCategoryPresent) {
            return res.status(StatusCodes.NOT_FOUND).json(
                {
                    success : false,
                    messag : "Category not found"
                }
            )
        }
        // upload thumbnail to cloudinary
        const thumbnailImageLink = await imageUploadToCloudinary(thumbnail, process.env.FOLDER_NAME);
        // create product on db
        const productDetails = await Product.create({
            productName,
            description,
            price,
            thumbnail : thumbnailImageLink,
            category,
            tag,
        });

        // insert product id on category model
        const categoryDetails = await Category.findByIdAndUpdate(
            {_id : category},
            {
                $push : {
                    products : productDetails._id
                }
            },
            {new: true}
        )
        // return responce
        return res.status(StatusCodes.OK).json(
            {
                success : true,
                message : "Product Created successfully"
            }
        );
        
    }catch(error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            {
                success : false,
                message : "Something went wrong while creating product"
            }
        )
    }
}