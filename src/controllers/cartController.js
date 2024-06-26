import { findCartById, createCart, updateCartById, deleteCartById } from '../dao/cartDao.js';

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
        const cart = await createCart(req.body);
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
