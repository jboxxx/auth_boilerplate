// Main starting point of the application
// i don't have all es6 syntax
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express(); // creating an instance of express
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.set('useCreateIndex', true); // handle to use some other method when using findOne
mongoose.connect("mongodb://localhost:27017/auth", { useNewUrlParser: true });

// App Setup (getting express set up properly)
// Setting up middlewares in morgan and bodyParse
// any incoming requests will be passed into our middleware first
app.use(morgan('combined')); // this is used just for logging incoming requests
app.use(bodyParser.json({ type: '*/*' })); // this is used to parse incoming requests into json, might have issue if posting a file
router(app);

// Server Setup (getting express to talk to the outside world)
const port = process.env.PORT || 3090; // if there is a defined port on the machine use that, otherwise use 3090
// http is natively available in node
// this creates a http server that knows how to receive http requests
// and anything that comes in, forward to on to our express application
const server = http.createServer(app);
server.listen(port); // listening to all incoming requests on port 3090
console.log('Server listening on ', port);
