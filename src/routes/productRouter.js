const express = require('express');
const Product = require('../models/productModel');
import { Router } from 'express';

export const productRouter = Router();

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        req.io.emit('new-product', savedProduct);
        res.status(201).json({ success: true, payload: savedProduct, message: 'Producto agregado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'No se pudo agregar el producto' });
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, payload: products, message: 'Productos obtenidos' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener los productos' });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realtimeproducts', { products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al renderizar la vista de productos en tiempo real' });
    }
});

module.exports = router;

