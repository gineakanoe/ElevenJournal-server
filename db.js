
const Sequelize = require("sequelize");                             // import sequelize package & create instance fot use in module with 'Sequelize' variable

const sequelize = new Sequelize("postgres://postgres:14b9c4a2e2ce45508f4991456a37ae47@localhost:5432/eleven-journal");  //2

module.exports = sequelize;                                         // export module


//2
/*  Use constructor to creat new sequelize object
        • 'postgres://postgres:pass@localhost:5432/dbname'
            - postgres = Identifies the database table to connect to. In our case, we are connecting to a postgres database
            - user = The username in order to connect to the database. In our case, this username is postgres.
            - password = The password used for the local database.
            - example.com:5432 = The host points to the local port for Sequelize. This is 5432.
            - dbname = The name we choose in order to identify a specific database.
*/ 