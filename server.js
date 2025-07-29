// 1. Panggil dotenv.config() PERTAMA KALI
const dotenv = require("dotenv");
dotenv.config();

// 2. Impor modul-modul lain
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./models/index");
const AdminRoutes = require("./routes/adminRoutes");
const AuthRoutes = require("./routes/authRoutes");
const FileRoutes = require("./routes/fileRoutes");
const ArticleRoutes = require("./routes/articleRoutes");
const ProfileRoutes = require("./routes/profileRoutes");
const CatDokumenPenRoutes = require("./routes/catDokumenPenRoutes");
const DokumenPenRoutes = require("./routes/dokumenPenRoutes");
const path = require("path");

const app = express();

// 3. Gunakan middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// 4. Definisikan rute Anda
app.use("/api/admins", AdminRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/files", FileRoutes);
app.use("/api/article", ArticleRoutes);
app.use("/api/profile", ProfileRoutes);
app.use("/api/catdokumenpen", CatDokumenPenRoutes);
app.use("/api/dokumenpen", DokumenPenRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  try {
    await db.sequelize.authenticate();
    console.log("Koneksi ke database berhasil.");
  } catch (error) {
    console.error("Tidak dapat terhubung ke database:", error);
  }
});
