let app = require("./express");
var longpoll = require("express-longpoll")(app);

module.exports = longpoll;
