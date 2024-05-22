import express from 'express';
import mongoose from 'mongoose';
import { viewRouter } from './routes/viewRouter.js';
import {productRouter}  from './routes/productRouter.js';
import { cartRouter } from './routes/cartRouter.js';
import { handlebarsConf } from './config/handlebarsConfig.js';
import { socketConf } from './config/socketConfig.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const httpServer = app.listen(8080, () => console.log('Servidor en el puerto 8080'));

handlebarsConf(app);

const io = socketConf(httpServer);

app.use((req, res, next) => {
    req.io = io;
    next();
});

mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/', viewRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

export { app };