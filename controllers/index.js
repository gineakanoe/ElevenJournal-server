
module.exports = {                                                      // exporting file as a module; exporting everything as an object
    userController: require("./usercontroller"),
    journalController: require("./journalcontroller"),                  // define property 'journalController' ; value of this property is the import of the 'journalController' file
};
