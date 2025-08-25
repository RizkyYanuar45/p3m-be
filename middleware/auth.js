const db = require("./../models");
const jwt = require("jsonwebtoken");
const Admin = db.Admin;

exports.protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Assuming the token is stored in cookies

    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token Kadaluwarsa Silahkan Login Ulang" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify the token (this is a placeholder, implement your own verification logic)
    const admin = await Admin.findOne({ where: { email: decoded.email } });
    if (!admin) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.admin = admin; // Attach admin to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
