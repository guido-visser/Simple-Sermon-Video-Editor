const express = require("express");
const bodyParser = require("body-parser");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const app = express();
const _ = require("lodash");
var longpoll = require("express-longpoll")(app);
app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

longpoll.create("/poll");

let currentJob = null;

app.get("/ping", function (req, res) {
    return res.json({ ping: "pong" });
});

app.post("/merge", function (req, res) {
    //res.json({ msg: "Merge started" });
    const { socket, ...other } = res;

    const files = req.body;

    let index = 0;
    let ff = null;
    try {
        _.forOwn(files, (filePath) => {
            if (index === 0) {
                ff = ffmpeg(filePath).withVideoCodec("libx264").addInputOption(["-hwaccel dxva2"]);
            } else {
                ff.input(filePath);
            }
            index++;
        });

        ff.on("end", function () {
            longpoll.publish("/poll", { action: "renderUpdate", msg: "files have been merged succesfully" });
            console.log("files have been merged succesfully");
        })
            .on("error", function (err) {
                longpoll.publish("/poll", { action: "renderUpdate", error: "an error happened: " + err.message });
                console.log("an error happened: " + err.message);
            })
            .on("progress", function (info) {
                longpoll.publish("/poll", { action: "renderUpdate", ...info });
            })
            .mergeToFile("./files/mergedService.mkv");
        res.json({ success: "yeah" });
    } catch (e) {
        res.json({ error: e });
    }

    /* currentJob = ffmpeg("./files/00000.mts")
        .withVideoCodec("libx264")
        .addInputOption(["-hwaccel dxva2"])
        .input("./files/00001.mts")
        .on("progress", function (info) {
            longpoll.publish("/poll", { action: "renderUpdate", ...info });
        })
        
        .mergeToFile("./files/mergedService.mkv"); */
});

app.get("/test", (req, res) => {
    ffmpeg.getAvailableCodecs(function (err, codecs) {
        console.log("Available codecs:");
        //res.json({ codecs });
    });

    ffmpeg.getAvailableEncoders(function (err, encoders) {
        console.log("Available encoders:");
        let video_encoders = {};
        _.forOwn(encoders, (encoder, key) => {
            if (encoder.type === "video") {
                video_encoders[key] = encoder;
            }
        });
        res.json({
            encoders: video_encoders,
        });
        console.dir(encoders);
    });
});

app.get("/stop", function (req, res) {
    res.json({ currentJob });
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
