const QRCode = require("qrcode");

// Utility function to generate QR code based on table number
const generateQRCode = (tableNumber) => {
  // Data to encode in the QR code (e.g., table number)
  const qrData = `https://restaurant-order-app.com/table/${tableNumber}`;

  // Generate QR code as a data URL
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(qrData, (err, url) => {
      if (err) {
        reject("Failed to generate QR code");
      } else {
        resolve(url); // Return the QR code URL (base64-encoded image)
      }
    });
  });
};

module.exports = { generateQRCode };
