import { v4 as uuidv4 } from 'uuid';

export class Product {
    #id;
    #title;
    #price;

    constructor(info) {
        this.#id = uuidv4(); 
        this.#title = this.#validateTitle(info.title);
        this.#price = this.#validatePrice(info.price);
    }

    #validateTitle(title) {
        if (!title) {
            throw new Error('El título es un campo requerido');
        }
        return title;
    }

    #validatePrice(price) {
        if (!price || price <= 0) {
            throw new Error('El precio es un campo requerido y debe ser mayor que cero');
        }
        return price;
    }

    toJSON() {
        return {
            id: this.#id,
            title: this.#title,
            price: this.#price,
        };
    }
}
