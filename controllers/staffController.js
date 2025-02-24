const Staff = require("../models/staff");

// Register new staff
exports.createStaff = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all staff members
exports.getStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find().populate("restaurantId");
    res.status(200).json(staffMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff)
      return res.status(404).json({ message: "Staff member not found" });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update staff by ID
exports.updateStaff = async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStaff)
      return res.status(404).json({ message: "Staff member not found" });
    res.status(200).json(updatedStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete staff by ID
exports.deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff)
      return res.status(404).json({ message: "Staff member not found" });
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
