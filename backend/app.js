const express = require("express");

const app = express();
app.use(express.json());

//import routes
const productRoute = require("./routes/productRoute");
//use routes
app.use("/api",productRoute);

module.exports = app;