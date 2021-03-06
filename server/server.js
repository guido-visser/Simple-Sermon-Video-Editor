const app = require("./express");
const lp = require("./longpoll");

lp.create("/poll");

app.get("/ping", function (req, res) {
    return res.json({ ping: "pong" });
});

//IMPORT ROUTES
const mainRoutes = require("./routes/main");
const processRoutes = require("./routes/process");
app.use("/api/main", mainRoutes);
app.use("/api/process", processRoutes);

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Publish every 50 seconds
setInterval(function () {
    lp.publish("/poll", { heartbeat: new Date().getTime() });
}, 50000);

app.listen(process.env.PORT || 8080);
