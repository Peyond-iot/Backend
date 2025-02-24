const Bill = require("../models/bill");
const Order = require("../models/order");

exports.createBill = async (req, res) => {
  try {
    const { tableId } = req.body; // Ensure both tableId and restaurantId are passed
    const restaurantId = req.user.restaurantId; // Ensure the user is associated with a restaurant
    if (!tableId || !restaurantId) {
      return res
        .status(400)
        .json({ message: "Table ID and Restaurant ID are required" });
    }

    // Fetch all unpaid orders for the specific table and restaurant
    const orders = await Order.find({
      tableId,
      paymentStatus: "pending",
      restaurantId, // Ensure only orders from the correct restaurant are included
    }).populate("items.menuItemId");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No unpaid orders found for this table" });
    }

    let mergedItems = [];
    let subtotal = 0;
    let discount = 0;

    // Merge items and calculate total
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existingItem = mergedItems.find((i) =>
          i.menuItemId.equals(item.menuItemId._id)
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.total += item.total;
        } else {
          mergedItems.push({
            menuItemId: item.menuItemId._id,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            name: item.menuItemId.name, // Include item name
          });
        }
      });

      subtotal += order.totalPrice;
      discount += order.discount;
    });

    // Define tax and service charge (Modify as per your policy)
    const tax = subtotal * 0.1; // 10% tax
    const serviceCharge = subtotal * 0.05; // 5% service charge
    const totalAmount = subtotal + tax + serviceCharge - discount;

    // Create merged bill without payment details
    const newBill = new Bill({
      restaurantId,
      tableId,
      items: mergedItems,
      subtotal,
      tax,
      serviceCharge,
      discount,
      totalAmount,
      paymentStatus: "pending", // Payment will be decided later
    });

    await newBill.save();

    // Mark all orders as billed for the specific table and restaurant
    await Order.updateMany(
      { tableId, paymentStatus: "pending", restaurantId },
      { paymentStatus: "paid" }
    );

    res
      .status(201)
      .json({ message: "Merged bill generated successfully", bill: newBill });
  } catch (error) {
    console.error(error); // For better error debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 2️⃣ Get Bill by ID
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 3️⃣ Update Bill Payment Status
exports.updateBillPayment = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    console.log(req.body);
    console.log(paymentStatus);
    const bill = await Bill.findById(req.params.id);

    if (!bill) return res.status(404).json({ message: "Bill not found" });

    bill.paymentStatus = paymentStatus;
    bill.paymentMethod = paymentMethod || bill.paymentMethod;
    bill.updatedAt = Date.now();

    await bill.save();
    res.status(200).json({ message: "Bill payment updated", bill });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 4️⃣ List All Bills (For Admin or Staff)
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
