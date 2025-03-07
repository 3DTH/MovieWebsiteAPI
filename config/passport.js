const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google Profile:', profile);
        
        if (!profile || !profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            return done(new Error('Thiếu thông tin email từ Google'));
        }

        // Kiểm tra user đã tồn tại bằng googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Kiểm tra email đã tồn tại
            user = await User.findOne({ email: profile.emails[0].value });
            
            if (user) {
                // Cập nhật googleId cho tài khoản hiện có
                user.googleId = profile.id;
                await user.save();
            } else {
                // Tạo user mới
                user = await User.create({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    password: 'google-oauth' // Thêm password mặc định
                });
            }
        }

        return done(null, user);
    } catch (error) {
        console.error('Error in Google Strategy:', error);
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}); 