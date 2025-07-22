const dotenv = require("dotenv");
const express = require("express");
const db = require("./models/index");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
dotenv.config();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World! Server API sudah berjalan.");
});

app.get("/users", async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error mengambil data user:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  try {
    await db.sequelize.authenticate();
    console.log("Koneksi ke database berhasil.");
    console.log("=== DEBUG ENV VARIABLES ===");
    console.log("DB_NAME:", process.env.DB_NAME);
  } catch (error) {
    console.error("Tidak dapat terhubung ke database:", error);
  }
});
