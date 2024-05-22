import express from 'express';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const cart = new Cart(req.body);
        const savedCart = await cart.save();
        res.status(201).json({ success: true, payload: savedCart, message: 'Carrito creado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'No se pudo crear el carrito' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(product => product.product.toString() !== pid);
        await cart.save();
        res.json({ success: true, payload: cart, message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'No se pudo eliminar el producto del carrito' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findByIdAndUpdate(cid, { products: req.body.products }, { new: true });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }
        res.json({ success: true, payload: cart, message: 'Carrito actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'No se pudo actualizar el carrito' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }

        const product = cart.products.find(p => p.product.toString() === pid);
        if (product) {
            product.quantity = quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        res.json({ success: true, payload: cart, message: 'Cantidad del producto actualizada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'No se pudo actualizar la cantidad del producto' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();
        res.json({ success: true, payload: cart, message: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'No se pudieron eliminar los productos del carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }
        res.json({ success: true, payload: cart, message: 'Carrito obtenido' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'No se pudo obtener el carrito' });
    }
});

export const cartRouter = router;
