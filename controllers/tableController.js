const Table = require("../models/table");

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const { tableNumber } = req.body;
    const restaurantId = req.user.restaurantId;

    const existingTable = await Table.findOne({ tableNumber, restaurantId });
    if (existingTable) {
      return res.status(400).json({ message: "Table number already exists" });
    }

    const newTable = new Table({ tableNumber, restaurantId });
    await newTable.save();
    res.status(201).json(newTable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tables
exports.getTables = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const tables = await Table.find({ restaurantId });
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific table by ID
exports.getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findOne({
      _id: id,
      restaurantId: req.user.restaurantId,
    });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update table
exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedTable = await Table.findOneAndUpdate(
      { _id: id, restaurantId: req.user.restaurantId },
      updatedData,
      { new: true }
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json(updatedTable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete table
exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTable = await Table.findOneAndDelete({
      _id: id,
      restaurantId: req.user.restaurantId,
    });

    if (!deletedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
