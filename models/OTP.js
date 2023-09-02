const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPschema = new mongoose.Schema(
    {
        email : {
            type : String,
            require : true,
        },
        otp : {
            type : Number,
            require : true,
        },
        createdAt : {
            type : Date,
            default : Date.now,
            expires : 60 * 5, // this model will automatically delete after 5 min
        }
    }
)

async function sendVerificationMail(email, otp) {
    try {
        const mailResponce = await mailSender(
            email,
            "Verification Mail",
            `Your OTP is ${otp}`,
        )
    }catch(error) {
        console.log("ERROR FROM OTP MODEL SEND VERIFICATION MAIL");
        console.log(error);
        throw error;
    }
}

OTPschema.pre("save", async function(next) {
    if(this.isNew) {
        await sendVerificationMail(this.email, this.otp);
    }
});

module.exports = mongoose.model('OTP', OTPschema);