const mongoose = require('mongoose');
require('dotenv').config();

const ConnectDB = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(() => {console.log("MongoDb Connected")})
    .catch((error) => {
        console.log(error);
        console.log("DB connection Issue");
        process.exit(1);
    })
}

module.exports = ConnectDB;