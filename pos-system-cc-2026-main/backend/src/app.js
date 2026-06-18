require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // <-- Importado de forma limpia arriba

const authRoutes     = require('./routes/auth');
const productRoutes  = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const clientRoutes   = require('./routes/clients');
const saleRoutes     = require('./routes/sales');
const reportRoutes   = require('./routes/reports');
const userRoutes     = require('./routes/users');
const evalRoutes     = require('./routes/eval');

const app = express();

// ─── CREACIÓN DINÁMICA DE CARPETA ────────────────────────────────────────────
// Construir la ruta absoluta hacia backend/uploads
const dir = path.join(__dirname, 'uploads');

// Verificar si el directorio NO existe y crearlo dinámicamente
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Directorio uploads/ creado dinámicamente en producción.');
}

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors()); // Permite todos los orígenes — NO recomendado en producción

// ─── PARSERS ─────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── ARCHIVOS ESTÁTICOS (imágenes) ───────────────────────────────────────────
// Ajustado para coincidir con la carpeta que acabamos de crear dinámicamente
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── RUTAS ───────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/clients',    clientRoutes);
app.use('/api/sales',      saleRoutes);
app.use('/api/reports',    reportRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/eval',       evalRoutes);  // Ruta de evaluación docente (requiere EVAL_SECRET)

// ─── MANEJO DE ERRORES GLOBAL ────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
// Endpoint de Health Check para Azure
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  });
});

module.exports = app;