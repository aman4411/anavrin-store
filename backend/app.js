const express = require("express");

const app = express();
const errorMidleware = require('./middleware/error');
app.use(express.json());

//import routes
const productRoute = require("./routes/productRoute");

//use routes
app.use("/api",productRoute);

//middleware for error
app.use(errorMidleware);

module.exports = app;