const multer = require("multer");
const path = require("path");
const ErrorHandler = require("../utils/errorHandler");

// membuat storage engine untuk multer untuk menyimpan file gambar yang diupload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ErrorHandler("Only image files are allowed!", 405));
    }
  },
});

module.exports = upload;
