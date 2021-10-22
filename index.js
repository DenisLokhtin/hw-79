const express = require('express');
const message = require('./app/app');
const fileDb = require('./fileDb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const port = 8000;

app.use('/message', message);

fileDb.init();
app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});

