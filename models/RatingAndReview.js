const mongoose = require("mongoose");

const ratingAndReviewSchema = mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            require : true,
        },
        rating : {
            type : Number,
            require : true,
        },
        review : {
            type : String,
            require : true,
        },
        products : {
            type : mongoose.Schema.Types.ObjectId,
            require : true,
        }
    }
)

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);