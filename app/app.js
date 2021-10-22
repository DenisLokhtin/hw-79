const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config')
const fileDB = require('../fileDb.js');

const {nanoid} = require("nanoid");
const ID = nanoid();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, ID + path.extname(file.originalname));
    },
});

const upload = multer({storage});

const router = express.Router();


router.get('/', (req, res) => {
    if (req.query.datetime === undefined) {
        const messages = fileDB.getItems();
        res.send(messages);
        return
    } else {
        const date = Date.parse(req.query.datetime);
        const lastMessages = fileDB.getLasts(date);
        res.send(lastMessages);
    }
});

router.post('/', upload.single('file'), (req, res) => {
    if (req.body.message !== '') {
        const currentDate = new Date();

        const body = {
            author: req.body.author,
            message: req.body.message,
            datetime: currentDate,
            id: ID,
        };

        if (req.file) {
            body.file = req.file.filename;
        }

        fileDB.addItem(body);
        res.setHeader('content-type', 'application/JSON');
        res.send(JSON.stringify(body));
    } else {
        res.status(400).send(JSON.stringify({"error": "Message must be present in the request"}))
    }
});

module.exports = router;