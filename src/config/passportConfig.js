import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/userModel.js';

export const passportConfig = (app) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user || !user.validatePassword(password)) {
                return done(null, false, { message: 'Credenciales incorrectas' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.use(new GitHubStrategy({
        clientID: 'your_client_id',
        clientSecret: 'your_client_secret',
        callbackURL: 'http://localhost:8080/auth/github/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                user = new User({ email: profile.emails[0].value, password: '', role: 'user' });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    app.use(passport.initialize());
    app.use(passport.session());
};
