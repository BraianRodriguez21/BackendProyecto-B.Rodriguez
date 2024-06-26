import { Router } from 'express';

const router = Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/products', (req, res) => {
    const token = req.query.token;
    res.render('products', { token });
});

export { router as viewRouter };
