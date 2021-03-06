const express = require("express");

const app = express();
const cookieParser = require('cookie-parser');
const errorMidleware = require('./middleware/error');


app.use(express.json());
app.use(cookieParser());

//import routes
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");

//use routes
app.use("/api",productRoute);
app.use("/api",userRoute)
app.use("/api",orderRoute);

//middleware for error
app.use(errorMidleware);

module.exports = app;