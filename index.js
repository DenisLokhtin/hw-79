const express = require('express');
const mysqlDb = require('./mysqlDb');
const cors = require('cors');
const locations = require('./routes/locations');
const categories = require('./routes/categories');
const items = require('./routes/items');
const upload = require('./routes/routesConfig')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/', locations);
app.use('/', categories);
app.use('/', items);
app.use(upload.array());
const port = 8001;

mysqlDb.connect().catch(e => console.log(e));
app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});

