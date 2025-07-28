const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  logoutAdmin,
  verifyResetToken,
  changePasswordWithToken,
  resetPasswordAdmin,
} = require("./../controllers/authController");

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
// router.post("/reset-password-admin", resetPasswordAdmin);
// router.post("/verify-reset-token", verifyResetToken);
// router.post("/change-password-with-token", changePasswordWithToken);

module.exports = router;
