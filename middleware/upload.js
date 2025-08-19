const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Simpan file ke memori untuk diproses oleh sharp
const storage = multer.memoryStorage();

// Filter file untuk memastikan hanya gambar yang diunggah
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan!"), false);
  }
};

// Middleware multer awal yang menangani upload ke memori dengan batas 3 MB
const upload = multer({
  storage: storage,
  limits: {
    // ✅ UBAH DI SINI: Batas ukuran file asli sebelum kompresi adalah 3 MB
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

// Middleware kedua untuk kompresi dengan Sharp
const compressAndSaveImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const newFilename = `${uuidv4()}.webp`;
  const outputPath = path.join("uploads", newFilename);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 1024, withoutEnlargement: true })
      .toFormat("webp", { quality: 80 })
      .toFile(outputPath);

    req.file.path = outputPath;
    req.file.filename = newFilename;
    req.file.mimetype = "image/webp";

    next();
  } catch (error) {
    console.error("Error saat kompresi gambar:", error);
    return next(error);
  }
};

// Ekspor array middleware yang akan dijalankan berurutan
const uploadAndCompress = (fieldName) => [
  upload.single(fieldName),
  compressAndSaveImage,
];

module.exports = uploadAndCompress;
