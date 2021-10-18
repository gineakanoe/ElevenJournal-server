
const router = require("express").Router();                     // Import Express framework & access Router() method = variable 'router'
const { UserModel } = require("../models");                     // Use object deconstructing to import user model and store it in 'UserModel' variable
const { UniqueConstraintError } = require("sequelize/lib/errors");  
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {                  // Use 'router' variable to get access into 'Router()' object

    const { email, password } = req.body.user;                    // Use object deconstruction to take parse the request; 'req.body' (middleware) is provided by Express & appends 2 key-value pairs to it. Then send it to database.
                                                                // 'req' = actual request; 'body' = where data is held; 'user' = property of 'body'; 'email' & 'password' = properties of user
                                                                // Basically:  `"req": { "body": { "user": { "email": , "password": }}}
    
    try {                                                       // added a 'try...catch' statement to catch any errors
        const User = await UserModel.create({                   // Capture returned promise with 'await' keyword since we don't want to store the data we get back from the database                        
            email,
            password: bcrypt.hashSync(password, 13)             // To encrypt password as user is created. 'password' is string the user enters, 13 is number of times password is salted.  10 is default.
        });
                                //What is attached to token         // secret password   // (seconds * minutes * hours) ; so expires in 1 day
        let token = jwt.sign({id: User.id /*email: User.email*/}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});          

        // res.send("This is our user/register endpoint!");       // Once user is created we send response back indicating success

        res.status(201).json({                                  // '.status()' adds status code  to response (201: Created) ; '.json()' packages response as json
            message: "User successfully registered",
            user: User,                                          // user data added to database is also sent to client and stored in 'user' property // Note: 'user' = key; 'User' = value
            sessionToken: token
        });                                                     
    } catch (err) {
        if (err instanceof UniqueConstraintError) {             // included 'if...else' statement
            res.status(409).json({
                message: "Email already in use",
            });
        } else {       
            res.status(500).json({
            message: "Failed to register user",
            });
        }
    }

});

router.post("/login", async(req,res) => {
        let { email, password } = req.body.user;

        try {
            const loginUser = await UserModel.findOne({           // 'findOne()' is Sequelize method that tries to find one element from matching model in database
                                                                // Also called 'Data Retrieval'
                where: {                                        // Filter where in database to search for element.  'where' = object of Sequelize
                    email: email,
                },
            });
            if (loginUser) {
                let passwordComparison = await bcrypt.compare(password, loginUser.password);

                if(passwordComparison) {                        // 'passwordComparison' is a boolean
                    let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

                    res.status(200).json({
                        user: loginUser,
                        message: "User successfully logged in!",
                        sessionToken: token
                    });
                } else {
                    res.status(401).json({
                        message: "Incorrect email or password"
                    })
                }
            } else {
                res.status(401).json({
                    message: "Incorrect email or password"
                });
            }
        } catch (error) {
            res.status(500).json({
                message: "Failed to log user in"
            })
        }
});


module.exports = router;                                        // Export module for usage outside of the file

