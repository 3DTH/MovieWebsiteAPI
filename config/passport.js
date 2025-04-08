const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Google Strategy
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
                    password: 'google-oauth' 
                });
            }
        }

        return done(null, user);
    } catch (error) {
        console.error('Error in Google Strategy:', error);
        return done(error);
    }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Facebook Profile:', profile);
        
        // Kiểm tra nếu profile không có email
        if (!profile || !profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            return done(new Error('Thiếu thông tin email từ Facebook'));
        }

        // Kiểm tra user đã tồn tại bằng facebookId
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
            // Kiểm tra email đã tồn tại
            user = await User.findOne({ email: profile.emails[0].value });
            
            if (user) {
                // Cập nhật facebookId cho tài khoản hiện có
                user.facebookId = profile.id;
                await user.save();
            } else {
                // Tạo user mới
                user = await User.create({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    facebookId: profile.id,
                    password: 'facebook-oauth' 
                });
            }
        }

        return done(null, user);
    } catch (error) {
        console.error('Error in Facebook Strategy:', error);
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