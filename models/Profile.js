const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
    {
        gender : {
            type: String,
            require: true,
        },
        dateOfBirth: {
            type: String,
            require : true,
        },
        contactNumber : {
            type: String,
            require : true,
        }
    }
)

module.exports = mongoose.model('Profile', profileSchema);