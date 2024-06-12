import { Router } from 'express';
import passport from 'passport';
import { User } from '../models/userModel.js';
import { generateToken } from '../config/jwtConfig.js';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado' });
        }
        const user = new User({ first_name, last_name, email, age, password });
        await user.save();
        res.json({ success: true, message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al registrar usuario' });
    }
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({ success: false, message: 'Credenciales incorrectas' });
        }
        const token = generateToken(user);
        res.json({ success: true, token });
    })(req, res, next);
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`/products?token=${token}`);
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

export { router as authRouter };
