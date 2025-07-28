const db = require("./../models");
const Profile = db.profile;
const fs = require("fs").promises;
const path = require("path");

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profiles", error });
  }
};
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findOne({ where: { id } });
    if (profile) {
      res.status(200).json(profile);
    } else {
      res.status(404).json({ message: "Profile not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};
exports.createProfile = async (req, res) => {
  try {
    // 1. Ambil data teks dari req.body
    const { alt, type } = req.body;

    // 2. Ambil path gambar dari req.file (jika ada)
    const imagePath = req.file ? req.file.path : null;

    // 3. Validasi data yang wajib diisi
    if (!type || !imagePath) {
      return res.status(400).json({ message: "Image and type are required" });
    }

    // 4. Siapkan data untuk disimpan ke database
    const newProfileData = {
      image: imagePath,
      alt,
      type,
    };

    // 5. Buat profil baru
    const profile = await Profile.create(newProfileData);

    res.status(201).json(profile);
  } catch (error) {
    console.error("ERROR CREATING PROFILE:", error);
    res
      .status(500)
      .json({ message: "Error creating profile", error: error.message });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Temukan profil yang ada untuk mendapatkan path gambar lama
    const profile = await Profile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    const oldImagePath = profile.image;

    // 2. Siapkan data baru dari request
    const { alt, type } = req.body;
    const updatedData = { alt, type };

    // Jika ada file baru yang diunggah, tambahkan path-nya
    if (req.file) {
      updatedData.image = req.file.path;
    }

    // 3. Update profil di database
    const [updated] = await Profile.update(updatedData, {
      where: { id },
    });

    if (updated) {
      // 4. Hapus gambar lama JIKA ada file baru dan path lama ada
      if (req.file && oldImagePath) {
        try {
          await fs.unlink(path.resolve(oldImagePath));
        } catch (unlinkError) {
          // Abaikan error jika file tidak ditemukan, tapi log untuk debugging
          console.error("Gagal menghapus gambar lama:", unlinkError.message);
        }
      }
      const updatedProfile = await Profile.findByPk(id);
      return res.status(200).json(updatedProfile);
    }

    // Seharusnya tidak pernah sampai sini jika findByPk berhasil, tapi sebagai penjaga
    throw new Error("Profile not found after update attempt.");
  } catch (error) {
    console.error("ERROR UPDATING PROFILE:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};
exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    const imagePath = profile.image;

    const deleted = await Profile.destroy({
      where: { id: id },
    });

    if (deleted) {
      if (imagePath) {
        try {
          await fs.unlink(path.resolve(imagePath));
        } catch (unlinkError) {
          console.error(
            "Gagal menghapus gambar (mungkin sudah tidak ada):",
            unlinkError.message
          );
        }
      }

      return res.status(200).json(profile);
    }

    throw new Error("Profile found but failed to delete.");
  } catch (error) {
    console.error("ERROR DELETING PROFILE:", error);
    res
      .status(500)
      .json({ message: "Error deleting profile", error: error.message });
  }
};
