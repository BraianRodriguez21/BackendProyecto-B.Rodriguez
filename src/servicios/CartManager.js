import fs from 'fs/promises';
import  { v4 as uuidv4 } from 'uuid';

class CartManager {
    constructor() {
        this.path = './files';
        this.fileName = `${this.path}/carrito.json`;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.fileName, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.fileName, JSON.stringify([]));
                return [];
            } else {
                throw error;
            }
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        const cart = { id: uuidv4(), products: [] };
        carts.push(cart);
        await fs.writeFile(this.fileName, JSON.stringify(carts, null, 2));
        return cart;
    }

    async getCartProducts(cid) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cid);
        if (!cart) throw new Error('Carrito no encontrado');
        return cart.products;
    }

    async addToCart(cid, pid, quantity) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cid);
        if (cartIndex === -1) throw new Error('Carrito no encontrado');

        const productIndex = carts[cartIndex].products.findIndex(p => p.id === pid);
        if (productIndex === -1) {
            carts[cartIndex].products.push({ id: pid, quantity });
        } else {
            carts[cartIndex].products[productIndex].quantity += quantity;
        }

        await fs.writeFile(this.fileName, JSON.stringify(carts, null, 2));
        return carts[cartIndex];
    }
}

export default CartManager;