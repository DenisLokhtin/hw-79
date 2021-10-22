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
    if (req.params.name === 'categories' || req.params.name === 'locations') {
        const [resources] = await mysqlDb.getConnection().query(
            'SELECT id, name FROM ??',
            [req.params.name]);
        res.send(resources);
        return
    } else {
        const [resources] = await mysqlDb.getConnection().query(
            'SELECT id, locations_id, categories_id, name FROM ??',
            [req.params.name]);
        res.send(resources);
    }
});

router.get('/:name/:id', async (req, res) => {
    const [resources] = await mysqlDb.getConnection().query(
        `SELECT * FROM ?? where id = ?`,
        [req.params.name, req.params.id]);
    res.send(resources[0]);
});


router.post('/:name', upload.single('file'), async (req, res) => {
    if (req.params.name === 'categories' || req.params.name === 'locations') {
        const body = {
            name: req.body.name,
            description: req.body.description,
        };

        const newResources = await mysqlDb.getConnection().query(
            'INSERT INTO ?? (name, description) values (?, ?)',
            [req.params.name, body.name, body.description]);

        res.send({
            ...body,
            id: newResources.insertId
        });
        return
    } else {
        const body = {
            name: req.body.name,
            description: req.body.description,
            locations_id: req.body.locations_id,
            categories_id: req.body.categories_id,
        };

        if (req.file) {
            body.file = req.file.filename;
        };

        const newResources = await mysqlDb.getConnection().query(
            'INSERT INTO ?? (locations_id, categories_id, name, description, image) values (?, ?, ?, ?, ?)',
            [req.params.name, body.locations_id, body.categories_id, body.name, body.description, body.file]);

        res.send({
            ...body,
            id: newResources.insertId
        });
    }
});

router.put('/:name/:id', upload.single('file'), async (req, res) => {
    if (req.params.name === 'categories' || req.params.name === 'locations') {
        const body = {
            name: req.body.name,
            description: req.body.description,
        };

        const updateResources = await mysqlDb.getConnection().query(
            'UPDATE ?? SET ? WHERE id = ?',
            [req.params.name, {...body}, req.params.id]);

        res.send({
            ...body
        });
        return
    } else {
        const body = {
            name: req.body.name,
            description: req.body.description,
            locations_id: req.body.locations_id,
            categories_id: req.body.categories_id,
        };

        if (req.file) {
            body.file = req.file.filename;
        };

        const updateResources = await mysqlDb.getConnection().query(
            'UPDATE ?? SET ? WHERE id = ?',
            [req.params.name, {...body}, req.params.id]);

        res.send({
            ...body
        });
    }
});

module.exports = router;