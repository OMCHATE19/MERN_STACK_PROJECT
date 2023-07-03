const express = require("express");

const app=express();
const errorMiddleware = require("./middleware/error");
app.use(express.json())
//route imports
const product=require("./routes/productroute");
const user =require("./routes/userRoutes");


app.use("/api/v1",product);
app.use("/api/v1",user);

//Middleware fore error
app.use(errorMiddleware);

module.exports = app;