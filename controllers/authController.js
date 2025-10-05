const db = require("./../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = db.Admin;

const loginAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;

    const admin = await Admin.findOne({ where: { name: name } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "10h",
      }
    );

    // Fixed cookie configuration
    const cookieOptions = {
      httpOnly: true,
      maxAge: 36000000, // 10 hours in milliseconds
      path: "/",
    };

    // Development vs Production cookie settings
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "None";
      if (process.env.DOMAIN) {
        cookieOptions.domain = process.env.DOMAIN;
      }
    } else {
      // Development settings
      cookieOptions.secure = false;
      cookieOptions.sameSite = "Lax";
    }

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        // Don't send password or sensitive data
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const logoutAdmin = (req, res) => {
  try {
    // Clear cookie with same options as when it was set
    const cookieOptions = {
      httpOnly: true,
      path: "/",
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "None";
      if (process.env.DOMAIN) {
        cookieOptions.domain = process.env.DOMAIN;
      }
    } else {
      cookieOptions.secure = false;
      cookieOptions.sameSite = "Lax";
    }

    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
};
