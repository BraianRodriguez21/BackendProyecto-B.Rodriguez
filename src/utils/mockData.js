import { faker } from '@faker-js/faker';

export const generateMockProducts = () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push({
            id: faker.datatype.uuid(),
            title: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price()),
            description: faker.commerce.productDescription(),
            imageUrl: faker.image.imageUrl(),
            stock: faker.datatype.number({ min: 0, max: 100 }),
            category: faker.commerce.department()
        });
    }
    return products;
};
