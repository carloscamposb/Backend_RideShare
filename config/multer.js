// multerConfig.js

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Diretório onde os arquivos serão armazenados temporariamente
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Nome do arquivo será o timestamp atual + extensão original
  }
});

const upload = multer({ storage });

module.exports = upload;
