const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config')
// const fileDB = require('../fileDb.js');
const mysqlDb = require('../mysqlDb')

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


router.get('/', async (req, res) => {
    if (req.query.datetime === undefined) {
        const [messages] = await mysqlDb.getConnection().query('SELECT * FROM locations');
        res.send(messages);
        return
    }
});

// router.post('/', upload.single('file'), (req, res) => {
//     if (req.body.message !== '') {
//         const currentDate = new Date();
//
//         const body = {
//             author: req.body.author,
//             message: req.body.message,
//             datetime: currentDate,
//             id: ID,
//         };
//
//         if (req.file) {
//             body.file = req.file.filename;
//         }
//
//         fileDB.addItem(body);
//         res.setHeader('content-type', 'application/JSON');
//         res.send(JSON.stringify(body));
//     } else {
//         res.status(400).send(JSON.stringify({"error": "Message must be present in the request"}))
//     }
// });

module.exports = router;