// 1. Panggil dotenv.config() PERTAMA KALI
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
// 2. Impor modul-modul lain
const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./models/index");
const AdminRoutes = require("./routes/adminRoutes");
const AuthRoutes = require("./routes/authRoutes");
const FileRoutes = require("./routes/fileRoutes");
const YoutubeRoutes = require("./routes/youtubeRoutes");
const ArticleRoutes = require("./routes/articleRoutes");
const ProfileRoutes = require("./routes/profileRoutes");
const CatDokumenPenRoutes = require("./routes/catDokumenPenRoutes");
const DokumenPenRoutes = require("./routes/dokumenPenRoutes");
const DokumenPengabRoutes = require("./routes/dokumenPengabRoutes");
const CatDokumenPengabRoutes = require("./routes/catDokumenPengabRoutes");
const CatDokumenProfRoutes = require("./routes/catDokumenProfRoutes");
const FormRoutes = require("./routes/formRoutes");
const DokumenProfRoutes = require("./routes/dokumenProfRoutes");
const path = require("path");

const app = express();

const allowedOrigins = [
  "http://sdnmojosari.site",
  "https://sdnmojosari.site",
  "http://www.sdnmojosari.site",
  "https://www.sdnmojosari.site",
  // Tambahkan juga origin localhost untuk pengembangan lokal jika perlu
  "http://localhost:5173",
];

// 3. Gunakan middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Akses diblokir oleh kebijakan CORS"));
      }
    },
    credentials: true,
  })
);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Folder 'uploads' berhasil dibuat.");
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
app.use("/api/dokumenpengab", DokumenPengabRoutes);
app.use("/api/catdokumenpengab", CatDokumenPengabRoutes);
app.use("/api/catdokumenprof", CatDokumenProfRoutes);
app.use("/api/dokumenprof", DokumenProfRoutes);
app.use("/api/forms", FormRoutes);
app.use("/api/youtube", YoutubeRoutes);

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
