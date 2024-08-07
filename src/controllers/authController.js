import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; 
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hash = await bcrypt.hash(resetToken, 10);
        user.resetPasswordToken = hash;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Restablecer contraseña',
            text: `Has solicitado restablecer tu contraseña. Haz clic en el enlace para restablecerla: 
            http://${req.headers.host}/reset-password/${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo electrónico enviado para restablecer la contraseña' });
    } catch (err) {
        next(err);
    }
};
export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isMatch) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
    } catch (err) {
        next(err);
    }
};

