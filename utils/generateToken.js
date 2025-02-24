const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // You can adjust the expiry time
  });
};

module.exports = { generateToken };
