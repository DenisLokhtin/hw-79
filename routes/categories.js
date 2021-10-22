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


router.get('/categories', async (req, res) => {
    const [resources] = await mysqlDb.getConnection().query(
        'SELECT id, name FROM categories');
    res.send(resources);
    return
});

router.get('/categories/:id', async (req, res) => {
    const [resources] = await mysqlDb.getConnection().query(
        `SELECT * FROM categories where id = ?`,
        [req.params.id]);
    res.send(resources[0]);
});


router.post('/categories', upload.single('file'), async (req, res) => {
    const body = {
        name: req.body.name,
        description: req.body.description,
    };

    const newResources = await mysqlDb.getConnection().query(
        'INSERT INTO categories (name, description) values (?, ?)',
        [body.name, body.description]);

    res.send({
        ...body,
        id: newResources.insertId
    });
    return
});

router.put('/categories/:id', upload.single('file'), async (req, res) => {
    const body = {
        name: req.body.name,
        description: req.body.description,
    };

    const updateResources = await mysqlDb.getConnection().query(
        'UPDATE categories SET ? WHERE id = ?',
        [{...body}, req.params.id]);

    res.send({
        ...body
    });
    return
});

router.delete('/categories/:id', async (req, res) => {
    try {
        const [resources] = await mysqlDb.getConnection().query(
            `DELETE FROM categories where id = ?`,
            [req.params.id]);
        res.status(204);
    } catch (e) {
        res.status(400).send({"message": e.sqlMessage});
        return
    }
});

module.exports = router;