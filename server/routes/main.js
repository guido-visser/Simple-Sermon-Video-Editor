const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");

router.post("/upload", (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.file;

    // Use the mv() method to place the file somewhere on your server
    const splittedFileName = file.name.split(".");
    const extension = splittedFileName[splittedFileName.length - 1];

    file.mv(`./upload/${file.name}`, function (err) {
        if (err) return res.status(500).send(err);

        res.json({ upload: "success" });
    });
});

module.exports = router;
