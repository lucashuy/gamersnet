const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

//routes
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

// express app
const app = express();

//DB connection
