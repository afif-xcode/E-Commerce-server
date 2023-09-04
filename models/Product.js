const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        productName : {
            type: String,
            required : true,
            trim : true,
        },
        description : {
            type : String,
            required : true,
            trim : true,
        },
        price: {
            type: String,
            required : true,
            trim : true,
        },
        isAvailable : {
            type : Boolean,
            required : true,
        },
        thumbnail : {
            type : String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        ratingAndReview : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref:"RatingAndReview"
            }
        ],
        tag : {
            type : [String],
            required : true,
        }
    }
)

module.exports = mongoose.model('Product', productSchema);