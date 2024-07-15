import faker from 'faker';

export const getMockingProducts = (req, res) => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push({
            id: faker.datatype.uuid(),
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department(),
            stock: faker.datatype.number({ min: 0, max: 100 })
        });
    }
    res.json({ success: true, products });
};
