import { Cart } from '../models/cartModel.js';

export const findCartById = async (id) => {
    return await Cart.findById(id).populate('products.product');
};

export const createCart = async (cartData) => {
    const cart = new Cart(cartData);
    return await cart.save();
};

export const updateCartById = async (id, updateData) => {
    return await Cart.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCartById = async (id) => {
    return await Cart.findByIdAndDelete(id);
};
