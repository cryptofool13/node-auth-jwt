const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = require("./account");

const fundsSchema = new Schema({
  timestamp: Date,
  accounts: [accountSchema]
});

module.exports = fundsSchema;
