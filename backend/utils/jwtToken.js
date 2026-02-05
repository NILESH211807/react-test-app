const jwt = require("jsonwebtoken");

// generate token
module.exports.generateToken = (payload) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return token;
};

// verify token
module.exports.verifyToken = (token) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
};
