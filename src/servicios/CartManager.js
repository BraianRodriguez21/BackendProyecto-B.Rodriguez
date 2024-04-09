import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const CART_FILE = 'carrito.json';

async function getCarts() {
    try {
        const data = await fs.readFile(CART_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(CART_FILE, JSON.stringify([]));
            return [];
        } else {
            throw error;
        }
    }
}

export async function createCart() {
    const carts = await getCarts();
    const cart = { id: uuidv4(), products: [] }; 
    carts.push(cart);
    await fs.writeFile(CART_FILE, JSON.stringify(carts, null, 2));
    return cart;
}

export async function getCartProducts(cid) {
    const carts = await getCarts();
    const cart = carts.find(cart => cart.id === cid);
    if (!cart) throw new Error('Carrito no encontrado');
    return cart.products;
}

export async function addToCart(cid, pid, quantity) {
    const carts = await getCarts();
    const cartIndex = carts.findIndex(cart => cart.id === cid);
    if (cartIndex === -1) throw new Error('Carrito no encontrado');

    const productIndex = carts[cartIndex].products.findIndex(p => p.id === pid);
    if (productIndex === -1) {
        carts[cartIndex].products.push({ id: pid, quantity });
    } else {
        carts[cartIndex].products[productIndex].quantity += quantity;
    }

    await fs.writeFile(CART_FILE, JSON.stringify(carts, null, 2));
    return carts[cartIndex];
}
