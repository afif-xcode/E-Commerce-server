const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type: String,
            require: true,
            trim : true,
        },
        lastName : {
            type: String,
            require : true,
            trim : true,
        },
        email : {
            type: String,
            require : true,
            trim : true,
        },
        password : {
            type : String,
            require: true,
        },
        role : {
            type : String,
            enum : ["Admin", "Customer"],
            require : true,
        },
        additionalDetails : {
            type: mongoose.Schema.Types.ObjectId,
            require : true,
            ref : "Profile"
        },
        address : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref : "Address"
            }
        ],
        orders : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Orders"
            }
        ],
        image : {
            type: String,
            require: true,
        },
    },
    {timestamps : true}
)

module.exports = mongoose.model('User', userSchema);