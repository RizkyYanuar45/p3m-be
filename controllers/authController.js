const db = require("./../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendMail = require("../helper/sendMail");
const cookieParser = require("cookie-parser");

const Admin = db.Admin;

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email: email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "10h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/",
      domain: process.env.DOMAIN,
      maxAge: 36000000, // 10 hour
    });
    res.status(200).json({ message: "Login successful", admin });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const logoutAdmin = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const resetPasswordAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email are required" });
    }
    const admin = await Admin.findOne({ where: { email: email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + 1);

    await Admin.update(
      { reset_token: resetToken, reset_token_expired: expiredAt },
      { where: { id: admin.id } }
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const htmlMessage = `
      <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
    `;
    await sendMail({
      to: email,
      subject: "Password Reset Request",
      html: htmlMessage,
      isHtml: true,
    });
    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const admin = await Admin.findOne({
      where: {
        reset_token: token,
      },
    });
    if (!admin) {
      return res.status(404).json({ message: "Invalid reset token" });
    }
    const now = new Date();
    if (admin.reset_token_expired && now > admin.reset_token_expired) {
      return ResponseAPI.error(res, "Link reset password sudah expired", 400);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const changePasswordWithToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    const admin = await Admin.findOne({
      where: {
        reset_token: token,
      },
    });
    if (!admin) {
      return res.status(404).json({ message: "Invalid reset token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Admin.update(
      {
        password: hashedPassword,
        reset_token: null,
        reset_token_expired: null,
      },
      { where: { id: admin.id } }
    );
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  verifyResetToken,
  changePasswordWithToken,
  resetPasswordAdmin,
};
