import jwt from 'jsonwebtoken';
import { config } from './config.js';

export const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
};


