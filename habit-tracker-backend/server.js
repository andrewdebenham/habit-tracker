const dotenv = require('dotenv');
dotenv.config();

const options = require('./knexfile');
const knex = require('knex')(options);
const helmet = require('helmet');

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const logger = require('morgan');

const usersRouter = require('./routes/users');
const habitsRouter = require('./routes/habits');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.db = knex;
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: true, message: 'Internal server error' });
});

app.use('/users', usersRouter);
app.use('/habits', habitsRouter);

app.listen(3000, () => {
    console.log('The express app is ready.');
});

