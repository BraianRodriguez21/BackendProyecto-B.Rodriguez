import express from 'express';
import { createCart, getCartProducts, addToCart } from '../services/CartManager.js'; 
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const newCart = {}; 
        const createdCart = await createCart(newCart);
        res.status(201).json(createdCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartProducts = await getCartProducts(cid);
        res.json(cartProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const updatedCart = await addToCart(cid, pid, 1); 
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

