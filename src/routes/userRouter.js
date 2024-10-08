// import { Router } from 'express';
// import User from '../servicios/userManagers';
// import bcrypt from 'bcrypt';

// const router = Router();

// router.post('/register', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = new User({ email, password });
//         await user.save();
//         res.status(201).json({ success: true, message: 'Usuario registrado' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
//     }
// });

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
//         }
//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
//         }
//         req.session.user = {
//             id: user._id,
//             email: user.email,
//             role: user.role
//         };
//         res.json({ success: true, message: 'Login exitoso' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
//     }
// });

// router.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
//         }
//         res.redirect('/login');
//     });
// });

// export default router;
import express from 'express';
import passport from 'passport';
import { 
    registerUser, 
    loginUser, 
    loginAdmin, 
    changeUserRole, 
    upgradeToPremium, 
    uploadDocuments 
} from '../controllers/userController.js';
import upload from '../config/multerConfig.js'; 

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', passport.authenticate('local', { session: false }), loginUser);

router.post('/login/admin', loginAdmin);

router.put('/premium/:uid', changeUserRole);

router.put('/premium/:uid/upgrade', upgradeToPremium);

router.post('/:uid/documents', upload.array('documents'), uploadDocuments);

export default router;
