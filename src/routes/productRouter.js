import express from 'express';
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../servicios/ProductManager.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await getAllProducts(limit ? parseInt(limit, 10) : undefined);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await getProductById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const createdProduct = await addProduct(newProduct);
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = req.body;
        const product = await updateProduct(pid, updatedProduct);
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await deleteProduct(pid);
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
