const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true,
  }, // Table ID that customers scan
  capacity: {
    type: Number,
    required: true,
  }, // How many people can sit at the table
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  }, // Current active order (if any)
});

module.exports = mongoose.model("Table", tableSchema);
