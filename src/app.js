import express from 'express';
import mongoose from 'mongoose';
import { viewRouter } from './routes/viewRouter.js';
import { handlebarsConf } from './config/handlebarsConfig.js';
import { productRouter } from './routes/productRouter.js';
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

mongoose.connect('mongodb+srv://braianrodriguez:ReinosXan21@ecommercegaming.dyihcoy.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=EcommerceGaming' , {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => console.log('Mongo connected'))
    .catch(err => console.error('Mongo connection error:', err))
console.log('base conectada')

app.use('/', viewRouter);
app.use('/api/products', productRouter);

export { app };