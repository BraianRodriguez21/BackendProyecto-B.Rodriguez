import express from 'express';
import { getProducts, getProductById, createProduct, updateProductById, deleteProductById } from '../controllers/productController.js';
import Product from '../models/productModel.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.put('/:id', updateProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The deleted product
 *       404:
 *         description: Product not found
 */
router.delete('/:id', deleteProductById);

/**
 * @swagger
 * /api/products/mockingproducts:
 *   get:
 *     summary: Retrieve a list of mocked products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of mocked products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/mockingproducts', async (req, res) => {
    try {
        // Aquí agregarías la lógica para obtener los productos mockeados.
        res.json({ success: true, products: [] }); // Modifica esta línea según tu lógica
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener los productos mockeados' });
    }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of paginated products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to return
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: The sort order (asc or desc)
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: A search query
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 totalPages:
 *                   type: integer
 *                 prevPage:
 *                   type: integer
 *                 nextPage:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 hasPrevPage:
 *                   type: boolean
 *                 hasNextPage:
 *                   type: boolean
 *                 prevLink:
 *                   type: string
 *                 nextLink:
 *                   type: string
 */
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        const filter = query ? { $or: [{ category: query }, { availability: query }] } : {};

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
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener los productos' });
    }
});

export { router as productRouter };
