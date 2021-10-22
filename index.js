const express = require('express');
const message = require('./app/app');
// const fileDb = require('./fileDb');
const mysqlDb = require('./mysqlDb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const port = 8000;

app.use('/', message);

// fileDb.init();
mysqlDb.connect().catch(e => console.log(e));
app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});

