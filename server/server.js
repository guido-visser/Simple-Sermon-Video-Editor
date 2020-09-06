const app = require("./express");
const lp = require("./longpoll");

lp.create("/poll");

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
