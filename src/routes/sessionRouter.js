import express from 'express';
import { UserRepository } from '../repositories/userRepository';

const router = express.Router();
const userRepository = new UserRepository();

router.get('/current', (req, res) => {
    if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
}
const userDTO = new UserDTO(req.user);
    res.json(userDTO);
});

export { router as sessionRouter };