// Import external module
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const cors = require("cors");

// Import downloaderRoute
const downloaderRoute = require("./routes/downloaderRoute");

// Import notFound and errorHandling middlewares
const notFound = require("./middlewares/notFound");
const errorHandling = require("./middlewares/errorHandling");

// Initialize app
const app = express();

// Enable cors
app.use(cors());

// Parse request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use static folder
app.use(express.static("public"));

// Set view engine
app.set("view engine", "ejs");

// Use downloaderRoute
app.use("/", downloaderRoute);

// Use notFound and errorHandling middlewares
app.use(notFound);
app.use(errorHandling);

// Listening to app
app.listen(process.env.PORT, process.env.HOST, (err) => {
  if (!err)
    console.log(
      `Server successfully running at http://${process.env.HOST}:${process.env.PORT}`
    );
});
