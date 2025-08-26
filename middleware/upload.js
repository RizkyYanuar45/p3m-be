const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// 1. Konfigurasi multer untuk menyimpan file sementara di memori (RAM)
const storage = multer.memoryStorage();

// 2. Filter untuk memastikan hanya file gambar yang diterima
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

// 3. Middleware multer awal yang menangani upload ke memori dengan batas 10 MB
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Batas file: 10 MB
  },
  fileFilter: fileFilter,
});

// 4. Middleware kedua untuk kompresi dan penyimpanan gambar dengan Sharp
const compressAndSaveImage = async (req, res, next) => {
  // Jika tidak ada file yang di-upload, lanjutkan ke controller berikutnya
  if (!req.file) {
    return next();
  } // Buat nama file unik dengan format .webp

  const newFilename = `${uuidv4()}.webp`;
  // Path untuk menyimpan file di server (menggunakan path.join agar kompatibel)
  const outputPath = path.join("uploads", newFilename);

  // Path yang akan disimpan ke database (selalu menggunakan forward slash)
  const databasePath = `uploads/${newFilename}`;

  try {
    // Proses kompresi dan penyimpanan file
    await sharp(req.file.buffer)
      .resize({ width: 1024, withoutEnlargement: true }) // Ubah lebar maks 1024px
      .toFormat("webp", { quality: 80 }) // Konversi ke WebP kualitas 80%
      .toFile(outputPath); // Simpan ke disk // Update objek req.file agar controller mendapatkan path yang benar

    req.file.path = databasePath;
    req.file.filename = newFilename;
    req.file.mimetype = "image/webp";

    next(); // Lanjutkan ke controller
  } catch (error) {
    console.error("Error saat kompresi gambar:", error);
    return next(error);
  }
};

// 5. Ekspor fungsi yang mengembalikan array middleware
const uploadAndCompress = (fieldName) => [
  upload.single(fieldName),
  compressAndSaveImage,
];

module.exports = uploadAndCompress;
