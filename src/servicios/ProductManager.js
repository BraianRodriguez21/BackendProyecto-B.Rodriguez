import { v4 as uuidv4 } from 'uuid';

export class ProductManager {
    #products;

    constructor() {
        this.#products = [
            { id: '1', title: 'Producto 1', price: 100 },
            { id: '2', title: 'Producto 2', price: 101 },
            { id: '3', title: 'Producto 3', price: 102 },
            { id: '4', title: 'Producto 4', price: 103 },
            { id: '5', title: 'Producto 5', price: 104 }
        ];
    }

    add(product) {
        const productWithId = {
            id: uuidv4(),
            ...product 
        };
        this.#products.push(productWithId); 
    }

    getProducts() {
        return this.#products; 
    }
}
