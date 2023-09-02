const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
    {
        line1 : {
            type : String,
            require : true,
        },
        city : {
            type : String,
            require: true,
        },
        state : {
            type : String,
            require : true,
        },
        postalCode : {
            type : Number,
            require : true,
        }
    }
)

module.exports = mongoose.exports('Address', addressSchema);