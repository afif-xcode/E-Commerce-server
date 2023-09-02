const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        productName : {
            type: String,
            require : true,
            trim : true,
        },
        description : {
            type : String,
            require : true,
            trim : true,
        },
        price: {
            type: String,
            require : true,
            trim : true,
        },
        isAvailable : {
            type : Boolean,
            require : true,
        },
        thumbnail : {
            type : String,
            require: true,
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
            require : true,
        }
    }
)

module.exports = mongoose.model('Product', productSchema);