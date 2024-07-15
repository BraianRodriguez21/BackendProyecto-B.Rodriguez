import express from 'express';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Ticket } from '../models/Ticket.js';
import { userOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

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

cart.products = cart.products.filter(item => failedProducts.includes(item.product._id));
    await cart.save();

res.json({
    ticket,
    failedProducts
});
});

export { router as cartRouter };
