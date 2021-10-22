const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config')
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


router.get('/:name', async (req, res) => {
    if (req.query.datetime === undefined) {
        const [resources] = await mysqlDb.getConnection().query(
            'SELECT * FROM ??',
            [req.params.name]);
        res.send(resources);
        return
    }
});

router.get('/:name/:id', async (req, res) => {
    if (req.query.datetime === undefined) {
        const [resources] = await mysqlDb.getConnection().query(
            `SELECT * FROM ?? where id = ?`,
            [req.params.name, req.params.id]);
        res.send(resources[0]);
        return
    }
});



router.post('/', upload.single('file'), async (req, res) => {
    if (req.body.message !== '') {

        const body = {
            author: req.body.author,
            message: req.body.message,
            id: ID,
        };

        if (req.file) {
            body.file = req.file.filename;
        }

        const newResources = await mysqlDb.getConnection().query(
            'INSERT INTO ?? ()',
            [req.params.name]);

        fileDB.addItem(body);
        res.setHeader('content-type', 'application/JSON');
        res.send(JSON.stringify(body));
    } else {
        res.status(400).send(JSON.stringify({"error": "Message must be present in the request"}))
    }
});

module.exports = router;