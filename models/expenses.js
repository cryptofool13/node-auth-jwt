const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = require("./item");

const expensesSchema = new Schema({
  timestamp: Date,
  items: [itemSchema]
});
