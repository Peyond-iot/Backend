// controllers/printController.js
const net = require("net");
const { Buffer } = require("buffer");

// Printer details (change these as per your setup)
const printerIp = "192.168.3.27"; // Replace with your printer's IP address
const printerPort = 9100; // Printer port, typically 9100

// Print function
const printOrder = (orderDetails) => {
  // ESC/POS commands to initialize the printer and print the order details
  const escPosCommands = Buffer.from([
    0x1b,
    0x40, // Initialize printer
    0x1b,
    0x61,
    0x01, // Center align
    ...Buffer.from(`Order Details:\n${orderDetails}\n`, "ascii"), // Print the order text
    0x1b,
    0x64,
    0x02, // Feed 2 lines
    0x1d,
    0x56,
    0x41,
    0x00, // Full cut (cut paper)
  ]);

  // Create a TCP connection to the printer
  const client = new net.Socket();
  return new Promise((resolve, reject) => {
    client.connect(printerPort, printerIp, () => {
      console.log("Connected to printer at", printerIp);
      client.write(escPosCommands); // Send the ESC/POS commands to the printer
      client.end(); // End the connection
      resolve("Printed successfully!");
    });

    client.on("error", (err) => {
      console.error("Error connecting to printer:", err.message);
      reject("Error printing.");
    });
  });
};

module.exports = {
  printOrder,
};
