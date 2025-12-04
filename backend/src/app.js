require("dotenv").config();
const express = require("express");
const app = express();

// middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;