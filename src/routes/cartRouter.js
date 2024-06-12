import { Router } from 'express';
import { Cart } from '../models/cartModel.js';

const router = Router();

router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('products.productId');
        res.json({ success: true, payload: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el carrito' });
    }
});

router.post('/:userId/products/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [{ productId }] });
        } else {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ productId });
            }
        }

        await cart.save();
        res.json({ success: true, payload: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al agregar producto al carrito' });
    }
});

router.put('/:userId/products/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            return res.status(404).json({ success: false, message: 'Producto no encontrado en el carrito' });
        }

        await cart.save();
        res.json({ success: true, payload: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar la cantidad del producto' });
    }
});

router.delete('/:userId/products/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);

        await cart.save();
        res.json({ success: true, payload: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto del carrito' });
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }

        cart.products = [];

        await cart.save();
        res.json({ success: true, payload: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar todos los productos del carrito' });
    }
});

export { router as cartRouter };
