// main starting point of application
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

const router = require("./router");

const app = express();

// db setup
mongoose.connect(
  "mongodb://localhost:27017/auth",
  { useNewUrlParser: true }
);

// app setup

app.use(morgan("combined"));

app.use(bodyParser.json({ type: "*/*" }));

router(app);

// server setup

const port = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(port);
console.log("server listening on port 8080");
