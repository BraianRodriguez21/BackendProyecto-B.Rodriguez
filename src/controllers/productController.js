import { findAllProducts, findProductById, createProduct, updateProductById, deleteProductById } from '../dao/productDao.js';
import { ErrorDictionary, CustomError } from '../utils/errorDictionary.js';

export const getProductById = async (req, res, next) => {
    try {
        const product = await findProductById(req.params.id);
        if (!product) {
            throw new CustomError(ErrorDictionary.PRODUCT_NOT_FOUND.message, ErrorDictionary.PRODUCT_NOT_FOUND.status);
        }
        res.json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (req, res, next) => {
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
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const product = await createProduct(req.body);
        res.json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

export const updateProductById = async (req, res, next) => {
    try {
        const product = await updateProductById(req.params.id, req.body);
        if (!product) {
            throw new CustomError(ErrorDictionary.PRODUCT_NOT_FOUND.message, ErrorDictionary.PRODUCT_NOT_FOUND.status);
        }
        res.json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

export const deleteProductById = async (req, res, next) => {
    try {
        const product = await deleteProductById(req.params.id);
        if (!product) {
            throw new CustomError(ErrorDictionary.PRODUCT_NOT_FOUND.message, ErrorDictionary.PRODUCT_NOT_FOUND.status);
        }
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        next(error);
    }
};
