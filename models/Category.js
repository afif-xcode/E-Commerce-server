const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
    {
        categoryName : {
            type : String,
            require : true,
        },
        description : {
            type: String,
            require : true,
        },
        products : [
            {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
            }
        ]
    }
)

module.exports = mongoose.model("Category", categorySchema);