import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { viewRouter } from './routes/viewRouter.js';
import { handlebarsConf } from './config/handlebarsConfig.js';
import { productRouter } from './routes/productRouter.js';
import { socketConf } from './config/socketConfig.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generateMockProducts } from './utils/mockData.js';
import { currentUser } from './utils/tokenUtils.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

const httpServer = app.listen(process.env.PORT || 8080, () => console.log(`Servidor en el puerto ${process.env.PORT || 8080}`));

handlebarsConf(app);

const io = socketConf(httpServer);

app.use((req, res, next) => {
    req.io = io;
    next();
});

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Mongo connected'))
.catch(err => console.error('error:', err));

app.use('/', viewRouter);
app.use('/api/products', productRouter);

app.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json({ success: true, products });
});

app.use(currentUser);

app.use(errorHandler);

export { app };
