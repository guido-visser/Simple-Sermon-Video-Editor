const router = require("express").Router();
const ffmpeg = require("fluent-ffmpeg");
const longpoll = require('../server');

router.post("/merge", function (req, res) {
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
});


module.exports = router;