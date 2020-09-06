const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
var longpoll = require("express-longpoll")(app);
app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

longpoll.create("/poll");

let currentJob = null;

app.get("/ping", function (req, res) {
    return res.json({ ping: "pong" });
});

//IMPORT ROUTES
const mainRoutes = require("./routes/main");
const processRoutes = require("./routes/process");
app.use("/api/main", mainRoutes);
app.use("/api/process", processRoutes);

app.get("/stop", function (req, res) {
    res.json({ currentJob });
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);

module.exports = longpoll;