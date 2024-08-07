import express from 'express';
import { getCartById, createCart, updateCartById, deleteCartById } from '../controllers/cartController.js';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/productModel.js';
import { Ticket } from '../models/Ticket.js';
import { userOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Cart management
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: The created cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.post('/', createCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Retrieve a cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart ID
 *     responses:
 *       200:
 *         description: A single cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 */
router.get('/:id', getCartById);

/**
 * @swagger
 * /api/carts/{id}:
 *   put:
 *     summary: Update a cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: The updated cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 */
router.put('/:id', updateCartById);

/**
 * @swagger
 * /api/carts/{id}:
 *   delete:
 *     summary: Delete a cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart ID
 *     responses:
 *       200:
 *         description: The deleted cart
 *       404:
 *         description: Cart not found
 */
router.delete('/:id', deleteCartById);

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Purchase the items in the cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart ID
 *     responses:
 *       200:
 *         description: The purchase was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticket:
 *                   $ref: '#/components/schemas/Ticket'
 *                 failedProducts:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of product IDs that couldn't be purchased due to insufficient stock
 *       404:
 *         description: Cart not found
 */
router.post('/:cid/purchase', userOnly, async (req, res) => {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    let totalAmount = 0;
    const purchasedProducts = [];
    const failedProducts = [];

    for (const item of cart.products) {
        if (item.product.stock >= item.quantity) {
            item.product.stock -= item.quantity;
            await item.product.save();
            totalAmount += item.product.price * item.quantity;
            purchasedProducts.push(item);
        } else {
            failedProducts.push(item.product._id);
        }
    }

    const ticket = new Ticket({
        code: `TICKET-${Date.now()}`,
        amount: totalAmount,
        purchaser: req.user.email
    });

    await ticket.save();

    cart.products = cart.products.filter(item => !failedProducts.includes(item.product._id));
    await cart.save();

    res.json({
        ticket,
        failedProducts
    });
});

export { router as cartRouter };

