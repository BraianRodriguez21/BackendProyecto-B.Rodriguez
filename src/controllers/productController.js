import { findAllProducts, findProductById, createProduct, updateProductById, deleteProductById } from '../dao/productDao.js';

export const getProducts = async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
        limit: parseInt(limit),
        skip: (page - 1) * limit,
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };
    try {
        const products = await findAllProducts(query ? JSON.parse(query) : {}, options);
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener productos' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await findProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener producto' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = await createProduct(req.body);
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear producto' });
    }
};

export const updateProductById = async (req, res) => {
    try {
        const product = await updateProductById(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar producto' });
    }
};

export const deleteProductById = async (req, res) => {
    try {
        const product = await deleteProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar producto' });
    }
};
