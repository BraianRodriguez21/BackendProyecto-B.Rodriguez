import express from 'express';
import Product from '../models/productModel';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        let mongoQuery = {};

        if (query) {
            mongoQuery = { $text: { $search: query } };
        }

        const totalProducts = await Product.countDocuments(mongoQuery);

        const totalPages = Math.ceil(totalProducts / limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const options = { skip: startIndex, limit };

        if (sort) {
            options.sort = sort;
        }

        const products = await Product.find(mongoQuery, null, options);

        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        const prevLink = prevPage ? `/api/products?limit=${limit}&page=${prevPage}` : null;
        const nextLink = nextPage ? `/api/products?limit=${limit}&page=${nextPage}` : null;

        res.json({ status: 'success', payload: products, totalPages, prevPage, nextPage, page, prevLink, nextLink });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener los productos' });
    }
});

export default router;
