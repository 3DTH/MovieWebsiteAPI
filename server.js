const dotenv = require("dotenv");
// Load env vars FIRST
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const movieRoutes = require("./routes/movieRoutes");
const favoriteRoutes = require('./routes/favoriteRoutes');
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const actorRoutes = require('./routes/actorRoutes');
const passport = require('passport');
const { errorHandler }  = require("./middleware/error");
require('./config/passport');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Thêm CSP headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +  // Chỉ cho phép tài nguyên từ cùng nguồn gốc
    "frame-src 'self' https://drive.google.com; " + // Cho phép nhúng iframe từ nguồn gốc và Google Drive
    "media-src 'self' https://drive.google.com; " + // Cho phép phát media từ nguồn gốc và Google Drive
    "img-src 'self' https://image.tmdb.org data:; " + // Cho phép hình ảnh từ nguồn gốc, TMDB và data URLs
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + // Cho phép JavaScript từ nguồn gốc và inline scripts
    "style-src 'self' 'unsafe-inline'; " + // Cho phép CSS từ nguồn gốc và inline styles
    "connect-src 'self' http://localhost:8080 https://api.themoviedb.org" // Cho phép kết nối API đến các domain được chỉ định
  );
  next();
});

// Thêm các security headers khác
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// CORS hiện tại
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/actors", actorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/favorites', favoriteRoutes);

// Thêm middleware passport
app.use(passport.initialize());

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});