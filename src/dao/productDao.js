import { Product } from '../models/productModel.js';

export const findAllProducts = async (query = {}, options = {}) => {
    return await Product.find(query, null, options);
};

export const findProductById = async (id) => {
    return await Product.findById(id);
};

export const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

export const updateProductById = async (id, updateData) => {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteProductById = async (id) => {
    return await Product.findByIdAndDelete(id);
};
