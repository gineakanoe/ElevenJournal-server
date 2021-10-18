
const { DataTypes} = require("sequelize");              //object destructuring used to extrapolate the DataTypes object from sequelize dependency
const db = require("../db");                            //import connnection to database that was setup in the db.js.  it unlocks methods from the called sequelize connection

const User = db.define("user", {                        //Where definition and creation of model takes place
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;