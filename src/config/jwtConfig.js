import jwt from 'jsonwebtoken';

const secret = 'your_jwt_secret';

export const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
    return jwt.verify(token, secret);
};
