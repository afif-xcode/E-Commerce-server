const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
    {
        categoryName : {
            type : String,
            required : true,
        },
        description : {
            type: String,
            required : true,
        },
        products : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
        ]
    }
)

module.exports = mongoose.model("Category", categorySchema);