import express from 'express';
import Product from '../models/productModel.js';

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
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };

        const filter = query ? { title: new RegExp(query, 'i') } : {};
        const products = await Product.paginate(filter, options);

        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener los productos' });
    }
});

export const productRouter = router;
