
///This is main page for server run command prompt for npx nodemon app.js

require("dotenv").config();
const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');

//const pool = require("./config/db");
const connection = require('./db')
const app = express();
const PORT = process.env.PORT;
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares to accept cross origin requests express server
const corsOptions = {
    origin: "http://localhost:3000/",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


connection.getConnection(function (err, conn) {
    // Do something with the connection
    if (err) throw err;
    console.log("Database Connected");
});
const usersRoute = require('./userroutes')
const nodemon = require("nodemon")


// Routes
app.use('/api/users', usersRoute)


// Test Route
app.get("/test", (req, res) => {
    res.json({
        message: "Api is running.",
    });
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

