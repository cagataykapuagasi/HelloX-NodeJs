const multer = require("multer");
const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./uploads/");
  },
  filename(req, file, callback) {
    callback(null, `${new Date().toISOString()}_${file.originalname}`);
  }
});
const upload = multer({
  storage: Storage,
  limits: { fieldSize: 5 * 1024 * 1024 }
});

module.exports = upload;
