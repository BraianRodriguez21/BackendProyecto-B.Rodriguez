import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/userModel.js';
import { verifyToken } from './jwtConfig.js';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
};

export const passportJwtConfig = (app) => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    }));

    app.use(passport.initialize());
};
