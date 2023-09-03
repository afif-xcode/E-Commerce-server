const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type: String,
            required: true,
            trim : true,
        },
        lastName : {
            type: String,
            required : true,
            trim : true,
        },
        email : {
            type: String,
            required : true,
            trim : true,
        },
        password : {
            type : String,
            required: true,
        },
        role : {
            type : String,
            enum : ["Admin", "Customer"],
            required : true,
        },
        additionalDetails : {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
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
            required: true,
        },
    },
    {timestamps : true}
)

module.exports = mongoose.model('User', userSchema);