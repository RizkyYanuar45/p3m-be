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

// Debug middleware (hapus di production)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.get("origin")}`);
  next();
});

// 3. CRITICAL: cookieParser HARUS sebelum CORS dan routes
app.use(cookieParser());

// CORS configuration - FIXED
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
].filter(Boolean); // Remove undefined values

console.log("Allowed origins:", allowedOrigins);
console.log("NODE_ENV:", process.env.NODE_ENV);

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request origin:", origin);

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Origin not allowed by CORS:", origin);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // CRITICAL untuk cookies
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "X-Access-Token",
    "Cookie", // Add Cookie header
  ],
  exposedHeaders: ["Set-Cookie"], // Expose Set-Cookie header
};

// Apply CORS with proper options
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debug middleware for cookies (hapus di production)
app.use((req, res, next) => {
  if (req.cookies && Object.keys(req.cookies).length > 0) {
    console.log("Cookies received:", Object.keys(req.cookies));
  }
  if (req.url.includes("/auth/")) {
    console.log("Auth request - Cookies:", req.cookies);
  }
  next();
});

// Test endpoint untuk debug cookies
app.get("/api/test-cookie", (req, res) => {
  console.log("=== TEST COOKIE ENDPOINT ===");
  console.log("Cookies received:", req.cookies);
  console.log("Headers:", req.headers);

  // Set test cookie
  res.cookie("test-cookie", "test-value-" + Date.now(), {
    httpOnly: false,
    maxAge: 60000, // 1 minute
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.json({
    message: "Test cookie set",
    cookiesReceived: req.cookies,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

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

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.message.includes("CORS")) {
    return res.status(403).json({
      message: "CORS Error",
      error: err.message,
    });
  }

  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);

  try {
    await db.sequelize.authenticate();
    console.log("Koneksi ke database berhasil.");
  } catch (error) {
    console.error("Tidak dapat terhubung ke database:", error);
  }
});
