const jwt = require("jsonwebtoken");                                                        // Import JWT package to interact with token assigned in each session
const { UserModel } = require("../models");                                                 // To communicate with user model in database

const validateJWT = async (req, res, next) => {                                             // Asyncronous fat arrow function 'validateJWT' declared & takes in 3 parameters (req, res, next)
    if(req.method == "OPTIONS") {                                                   // Conditional statement checking method of request.  Is the actual request safe to send. First part of preflight request
        next();                                                                         // If valid preflight request, pass to third parameter 'next()' which exits function & passes control to the next middleware function
    } else if(                                                                              //* If POST, GET, PUT, or DELETE request, 
        req.headers.authorization &&                                                                // is there data in authorization header of request   
        req.headers.authorization.includes("Bearer")                                            // AND does string include word 'Bearer'
    ) {
        const { authorization } = req.headers;                                              // Use object destructtion to pull value of authorization header & store in 'authorization' variable
        // console.log("authorization -->", authorization);
        const payload = authorization                                                       //* This is a 'ternary'.  Verify if 'authorization' contains truthy value. & store truthy value in 'payload' variable
         ? jwt.verify(                                                                          // Call JWT package & invoke 'verify' method to decode token
             authorization.includes("Bearer")                                                       // First Method: Use 'authorization' variable; 
                ? authorization.split(" ")[1]                                                           // If token includes word "Beaer", extrapolate and return token from whole string
                : authorization,                                                                        // If token does not include word "Bearer", return just token
            process.env.JWT_SECRET                                                                  // Secon Method: Use 'JWT_SECRET' in '.env' file to decrypt token
         )
         : undefined;                                                                           // If no truthy value, return value of 'undefined' which is stored in 'payload' variable
        
        // console.log("payload -->", payload);
        
         if(payload) {                                                                       //* Another conditional statement to check for truthy value in 'payload'
            let foundUser = await UserModel.findOne({ where: { id: payload.id } });         // If 'payload' = truthy value; Use Sequelize's 'findOne' method to look for user in UserModel where ID of user in database matches ID stored in token.  Then store value of located user in 'fourdUser' variable
            // console.log("foundUser -->", foundUser);

            if(foundUser) {                                                                     // Another conditional statement. Is 'foundUser' truthy?
                // console.log("request -->", req);
                req.user = foundUser;                                                               // If 'foundUser' is truthy, create new property 'user' to Express's request object.  Value in new property 'user' is the info stored in 'foundUser'.
               
                next();                                                                                 // Now have access to third parameter 'next()' which exits function & passes control to next middleware function.
            } else {                                                                                // Else; If 'foundUser' is not truthy (aka not found in database)
                res.status(400).send({ message: "Not Authorized" });                                    // 400 "Bad Request" -  Message: "Not Authorized"
            }
        } else {                                                                            // Else; If 'payload' = undefined
            res.status(401).send({ message: "Invalid token" });                                 // 401 "Unauthorized" - Message: "Invalid Token"
        }
    } else {                                                                            // Else; If authorization object in 'headers' object = empty || !"Bearer"
        res.status(403).send({ message: "Forbidden" });                                     // 403 "Forbidden" - Message: "Forbidden"
    }
};


//! NOTE: SECURITY SHOULD BE #1, #2, AND #3 PROIORITIES WHEN CODING

module.exports = validateJWT;