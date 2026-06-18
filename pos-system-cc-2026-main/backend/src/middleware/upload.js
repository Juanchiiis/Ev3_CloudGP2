const multer = require('multer');
const path = require('path');

// 🚀 CAMBIO CLAVE: Usamos memoryStorage en lugar de diskStorage
// El archivo se queda en la RAM (req.file.buffer) y nunca toca la carpeta uploads/
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) &&
                  allowed.test(file.mimetype);
  isValid ? cb(null, true) : cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB de límite
});

module.exports = upload;