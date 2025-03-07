const dotenv = require("dotenv");
// Load env vars FIRST
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");
const movieRoutes = require("./routes/movieRoutes");
const favoriteRoutes = require('./routes/favoriteRoutes');
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const { errorHandler }  = require("./middleware/error");
const { syncMovies } = require('./controllers/movieController');
const cron = require('node-cron');
const actorRoutes = require('./routes/actorRoutes');
const passport = require('passport');
require('./config/passport');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Chạy job mỗi ngày lúc 00:00
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Bắt đầu đồng bộ dữ liệu phim...');
        await syncMovies();
        console.log('Đồng bộ dữ liệu phim thành công');
    } catch (error) {
        console.error('Lỗi đồng bộ dữ liệu:', error);
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});