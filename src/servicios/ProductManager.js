import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor() {
        this.path = './files';
        this.fileName = `${this.path}/products.json`;
    }

    async getAllProducts(limit) {
        const products = await this.getProducts();
        return limit ? products.slice(0, limit) : products;
    }

    async getProductById(pid) {
        const products = await this.getProducts();
        return products.find(product => product.id === pid);
    }

    async addProduct(newProduct) {
        const products = await this.getProducts();
        newProduct.id = this.generateProductId();
        products.push(newProduct);
        await fs.promises.writeFile(this.fileName, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(pid, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === pid);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
        products[index] = { ...products[index], ...updatedProduct };
        await fs.promises.writeFile(this.fileName, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(pid) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(product => product.id !== pid);
        await fs.promises.writeFile(this.fileName, JSON.stringify(filteredProducts, null, 2));
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.fileName, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    generateProductId() {
        return uuidv4();
    }
}

export default ProductManager;
