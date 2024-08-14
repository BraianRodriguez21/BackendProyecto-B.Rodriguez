import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app.js'; 
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

describe('Products API', () => {
    before(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('should create a new product', async () => {
        const res = await chai.request(app)
            .post('/api/products')
            .send({
                name: 'Product Test',
                price: 10,
                description: 'Test description'
            });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('product');
        expect(res.body.product).to.have.property('name', 'Product Test');
    });

    it('should fetch all products', async () => {
        const res = await chai.request(app).get('/api/products');

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('products');
        expect(res.body.products).to.be.an('array');
    });

    it('should fetch a single product by ID', async () => {
        const product = await chai.request(app)
            .post('/api/products')
            .send({
                name: 'Product Test',
                price: 10,
                description: 'Test description'
            });

        const res = await chai.request(app).get(`/api/products/${product.body.product._id}`);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('product');
        expect(res.body.product).to.have.property('name', 'Product Test');
    });
});
