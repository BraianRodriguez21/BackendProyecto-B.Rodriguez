import express from 'express';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.get('/', (req, res) => {
    res.send('Bienvenido');
});

app.listen(port, () => {
    console.log(`La aplicación está escuchando en el puerto ${port}`);
});