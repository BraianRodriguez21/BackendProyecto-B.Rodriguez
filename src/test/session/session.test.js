import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Sessions API', () => {
    it('should register a new user', async () => {
        const res = await chai.request(app)
            .post('/api/sessions/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('email', 'test@example.com');
    });

    it('should login an existing user', async () => {
        await chai.request(app)
            .post('/api/sessions/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        const res = await chai.request(app)
            .post('/api/sessions/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
    });

    it('should not login with incorrect password', async () => {
        await chai.request(app)
            .post('/api/sessions/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        const res = await chai.request(app)
            .post('/api/sessions/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(res).to.have.status(401);
        expect(res.body).to.have.property('message', 'Invalid credentials');
    });
});
