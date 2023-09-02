const express = require('express');
const app = express();
require('dotenv').config();
const ConnectDB = require('./config/database');
const PORT = process.env.PORT;


// Connect with Db
ConnectDB();

// middleware
app.use(express.json());

app.get('/', (req,res) => {
    res.send("Hello World").status(200);
})

app.listen(PORT, () => {
    console.log(`Your server is runnig on port ${PORT}`)
})