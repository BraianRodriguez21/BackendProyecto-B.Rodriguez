import User from '../models/userModel.js';
import { findUserByEmail, createUser } from '../dao/userDao.js';
import { generateToken } from '../config/jwtConfig.js';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';
import logger from '../config/loggerConfig.js';

export const changeUserRole = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        res.status(200).json({ message: `Rol del usuario actualizado a ${user.role}` });
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

export const registerUser = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Asynchronous hashing
        const user = await createUser({ first_name, last_name, email, age, password: hashedPassword });
        res.json({ success: true, message: 'Usuario registrado exitosamente', user });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ success: false, message: 'Error al registrar usuario' });
    }
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) { // Asynchronous comparison
            return res.status(400).json({ success: false, message: 'Credenciales incorrectas' });
        }
        const token = generateToken(user);
        res.json({ success: true, token });
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

export const loginAdmin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (email === config.adminEmail && password === config.adminPassword) {
            const adminUser = { email, role: 'admin' };
            const token = generateToken(adminUser);
            return res.json({ success: true, token });
        } else {
            return res.status(400).json({ success: false, message: 'Credenciales de admin incorrectas' });
        }
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

export const uploadDocuments = async (req, res) => {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const documents = req.files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));
        user.documents.push(...documents);
        await user.save();

        res.status(200).json({ success: true, message: 'Documentos subidos correctamente' });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ success: false, message: 'Error al subir documentos' });
    }
};

export const upgradeToPremium = async (req, res) => {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const requiredDocs = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
        const uploadedDocs = user.documents.map(doc => doc.name);
        const hasAllDocs = requiredDocs.every(doc => uploadedDocs.includes(doc));

        if (!hasAllDocs) {
            return res.status(400).json({ success: false, message: 'El usuario no ha subido todos los documentos requeridos' });
        }

        user.role = 'premium';
        await user.save();

        res.status(200).json({ success: true, message: 'El usuario ha sido actualizado a premium' });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ success: false, message: 'Error al actualizar el usuario a premium' });
    }
};
