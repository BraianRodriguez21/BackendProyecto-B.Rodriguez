import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const PRODUCTS_FILE = 'productos.json';

export async function getAllProducts(limit) {
    const products = await getProducts();
    return limit ? products.slice(0, limit) : products;
}

export async function getProductById(pid) {
    const products = await getProducts();
    return products.find(product => product.id === pid);
}

export async function addProduct(newProduct) {
    const products = await getProducts();
    newProduct.id = generateProductId();
    products.push(newProduct);
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return newProduct;
}

export async function updateProduct(pid, updatedProduct) {
    const products = await getProducts();
    const index = products.findIndex(product => product.id === pid);
    if (index === -1) {
        throw new Error('Producto no encontrado');
    }
    products[index] = { ...products[index], ...updatedProduct };
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return products[index];
}

export async function deleteProduct(pid) {
    const products = await getProducts();
    const filteredProducts = products.filter(product => product.id !== pid);
    await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(filteredProducts, null, 2));
}

async function getProducts() {
    const data = await fs.promises.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data) || [];
}

function generateProductId() {
    return uuidv4();
}
