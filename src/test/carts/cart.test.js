import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app.js';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

describe('Carts API', () => {
    before(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('should create a new cart', async () => {
        const res = await chai.request(app)
            .post('/api/carts')
            .send({ items: [] });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('cart');
        expect(res.body.cart).to.have.property('items').that.is.an('array');
    });

    it('should fetch a cart by ID', async () => {
        const cart = await chai.request(app)
            .post('/api/carts')
            .send({ items: [] });

        const res = await chai.request(app).get(`/api/carts/${cart.body.cart._id}`);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('cart');
        expect(res.body.cart).to.have.property('items').that.is.an('array');
    });

    it('should add an item to a cart', async () => {
        const cart = await chai.request(app)
            .post('/api/carts')
            .send({ items: [] });

        const res = await chai.request(app)
            .put(`/api/carts/${cart.body.cart._id}`)
            .send({ items: [{ productId: 'productId123', quantity: 1 }] });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('cart');
        expect(res.body.cart.items).to.have.lengthOf(1);
        expect(res.body.cart.items[0]).to.have.property('productId', 'productId123');
    });
});
