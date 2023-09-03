const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');


// is logged in or not
exports.auth = async(req, res, next) => {
    try {
        // Extracting JWT from request cookies, body, or header
        const token = 
            req.cookies.token || 
            req.body.token || 
            req.header("Authorization").replace("Bearer ", "");

        console.log(token);
        
        // If JWT token is missing, return Unuthorized responce
        if(!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success : false,
                message : "Token Missing"
            })
        }

        try {
            // Verifying the JWT token user secret key
            console.log('ho');
            console.log(process.env.JWT_SECRET);
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // storing the decoded JWT Payload in the request objce for further use
            req.user = decode;
            console.log("Hello jee kaise ho ",decode);
        }catch(error) {
            // If Jwt token verifying failed 
            console.log("ERROR FROM JWT TOKEN VERIFY")
            console.log(error);
            return res.status(StatusCodes.UNAUTHORIZED).json(
                {
                    success : false,
                    message : "Token is Invalid"
                }
            )
        }
        // If JWT is valid, mon on to the next middleware or request handler
        next();
    }catch(error) {
        console.log('ERROR FROM MIDDLEWARE AUTH');
        console.log(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            {
                success : false,
                message : "Something went wrong while verifying token"
            }
        )
    }
}

// is Customer or not 
// is Admin or not 