const Bill = require("../models/bill");
const Order = require("../models/order");

exports.createBill = async (req, res) => {
  try {
    const { orderId, paymentMethod, notes } = req.body;

    // Fetch order details with populated menuItemId to get the name of each item
    const order = await Order.findById(orderId).populate("items.menuItemId"); // Populate menuItemId
    console.log(order);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { tableId, items, totalPrice, discount, restaurantId, customerId } =
      order;

    // Modify the items to include the name field from the populated menuItemId
    const updatedItems = items.map((item) => ({
      menuItemId: item.menuItemId._id, // Use the menuItemId (ObjectId)
      quantity: item.quantity,
      price: item.price,
      total: item.total,
      name: item.menuItemId.name, // Add the name from the populated MenuItem
    }));

    // Define tax and service charge (Modify these as per your restaurant policy)
    const tax = totalPrice * 0.1; // 10% tax
    const serviceCharge = totalPrice * 0.05; // 5% service charge

    // Calculate final amount
    const finalAmount = totalPrice + tax + serviceCharge - discount;

    // Create new Bill with updated items
    const newBill = new Bill({
      restaurantId,
      customerId,
      tableId,
      items: updatedItems, // Include updated items with the name field
      subtotal: totalPrice,
      tax,
      serviceCharge,
      discount,
      totalAmount: finalAmount,
      paymentStatus: "pending",
      paymentMethod,
      notes,
    });

    await newBill.save();
    res
      .status(201)
      .json({ message: "Bill generated successfully", bill: newBill });
  } catch (error) {
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
