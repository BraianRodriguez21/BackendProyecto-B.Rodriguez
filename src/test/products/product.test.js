import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Product API', () => {
    it('should create a product', (done) => {
        const newProduct = { name: 'Test Product', price: 100 };

        chai.request(app)
            .post('/api/products')
            .send(newProduct)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.be.true;
                done();
            });
    });
});
