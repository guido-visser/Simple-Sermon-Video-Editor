const express = require("express");
const bodyParser = require("body-parser");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const app = express();
var longpoll = require("express-longpoll")(app);
app.use(express.static(path.join(__dirname, "build")));

longpoll.create("/poll");

app.get("/ping", function (req, res) {
    return res.json({ ping: "pong" });
});

app.get("/merge", function (req, res) {
    res.json({ msg: "Merge started" });
    ffmpeg("./files/00000.mts")
        .input("./files/00001.mts")
        .on("progress", function (info) {
            longpoll.publish("/poll", { action: "renderUpdate", ...info });
        })
        .on("end", function () {
            longpoll.publish("/poll", { action: "renderUpdate", msg: "files have been merged succesfully" });
            console.log("files have been merged succesfully");
        })
        .on("error", function (err) {
            longpoll.publish("/poll", { action: "renderUpdate", error: "an error happened: " + err.message });
            console.log("an error happened: " + err.message);
        })
        .mergeToFile("./files/mergedService.mkv")
        .videoCodec("vp9");
});

app.get("/test", (req, res) => {
    ffmpeg.getAvailableCodecs(function (err, codecs) {
        console.log("Available codecs:");
        //res.json({ codecs });
    });

    ffmpeg.getAvailableEncoders(function (err, encoders) {
        console.log("Available encoders:");
        res.json({ encoders });
        console.dir(encoders);
    });
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
