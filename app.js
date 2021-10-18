
require("dotenv").config();
const Express = require("express");                                     // Require the use of the express npm package
const app = Express();                                                  // Allows us to create an Express app
const dbConnection = require("./db");                                   // Create variable that imports 'db' file

app.use(require("./middleware/headers"));

const controllers = require("./controllers");                           // import controllers as bundle through object exported in index.js and store in variable 'controllers'
        //! ↓This MUST go above any other routes or your app will break 

app.use(Express.json());                                                // Express processes requests to server & converts request to json to parse & interprete data

app.use("/user", controllers.userController);

// app.use(require("./middleware/validate-jwt"));                       //! better option for us is to add this directly to our journalController

app.use("/journal", controllers.journalController);                     // called 'app.use' and created base URL '/journal' - baseURL = http://localhost:3000/journal
                                                                            // and pass in 'controllers' object & use dotnotation to access desired journalController

dbConnection.authenticate()                                             // use 'db' variable to access sequelize instanct & methods from 'db' file 
                                                                            // Also calls 'authenticat()' method --> an asynchronous method that runs a 'SELECT 1+1 AS result' query <-- and returns promise
    .then(() => dbConnection.sync())  // => {force: true} {alter: true} // Promise resolver.  calls 'sync()' method.  ensures all defined models to the database are synced
    .then(() => {                                                       // Use promise resolver to acces returned promise from 'sync()' method & fire function that shows we are connected
        app.listen(3000, () => {                                        // app.listen uses express to start a UNIX socket and listen for connections on given path.  aka localhost:3000
        console.log(`[Server]: App is listening on 3000.`);             // returns a message with the port that the server is running on
        });
    })
    .catch((err) => {                                                   // Promise Rejection.  Fires off error if any errors
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });


