import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findUserByEmail } from '../dao/userDao.js';
import bcrypt from 'bcrypt';

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

export default passport;

