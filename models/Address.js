const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
    {
        line1 : {
            type : String,
            required : true,
        },
        city : {
            type : String,
            required: true,
        },
        state : {
            type : String,
            required : true,
        },
        postalCode : {
            type : Number,
            required : true,
        }
    }
)

module.exports = mongoose.exports('Address', addressSchema);