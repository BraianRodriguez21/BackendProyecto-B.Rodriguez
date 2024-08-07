import { findCartById, createCart as daoCreateCart, updateCartById, deleteCartById } from '../dao/cartDao.js';
import Product from '../models/productModel.js'; // Ajusta según tu estructura de archivos

export const addToCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (product.owner === req.user.email && req.user.role === 'premium') {
            return res.status(400).json({ message: 'Los usuarios premium no pueden agregar sus propios productos al carrito.' });
        }

        const updatedCart = await addToCartDao(req.user.id, productId);
        res.json({ success: true, cart: updatedCart });
    } catch (error) {
        next(error);
    }
};

export const getCartById = async (req, res) => {
    try {
        const cart = await findCartById(req.params.id);
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener carrito' });
    }
};

export const createCart = async (req, res) => {
    try {
        const cart = await daoCreateCart(req.body);
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear carrito' });
    }
};

export const updateCartById = async (req, res) => {
    try {
        const cart = await updateCartById(req.params.id, req.body);
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar carrito' });
    }
};

export const deleteCartById = async (req, res) => {
    try {
        const cart = await deleteCartById(req.params.id);
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
        }
        res.json({ success: true, message: 'Carrito eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar carrito' });
    }
};
