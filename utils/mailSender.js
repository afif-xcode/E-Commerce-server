const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body) => {
    try {
        let mailTransporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS,
            }
        })
    
        let mailDetails = {
            from : `Delicious Zone || <${process.env.MAIL_USER}>`,
            to : `${email}`,
            subject : `${title}`,
            html : `${body}`
        }
    
        let responce = mailTransporter.sendMail(mailDetails);

        console.log("Mail sending Responce ->>>", responce);
        return responce;
    }catch(error) {
        console.log(error);
    }
}

module.exports = mailSender;