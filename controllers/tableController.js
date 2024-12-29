const Table = require("../models/table");

// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().populate("currentOrder");
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new table
exports.createTable = async (req, res) => {
  const { tableNumber, capacity, currentOrder } = req.body;

  // Validate required fields
  if (tableNumber == null || capacity == null) {
    return res
      .status(400)
      .json({ message: "Table number and capacity are required" });
  }

  const table = new Table({
    tableNumber,
    capacity,
    currentOrder,
  });

  try {
    const newTable = await table.save();
    res.status(201).json(newTable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a table by ID
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate("currentOrder");
    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a table
exports.updateTable = async (req, res) => {
  try {
    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTable)
      return res.status(404).json({ message: "Table not found" });
    res.json(updatedTable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json({ message: "Table deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
