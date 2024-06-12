import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import { viewRouter } from './routes/viewRouter.js';
import { productRouter } from './routes/productRouter.js';
import { cartRouter } from './routes/cartRouter.js';
import { authRouter } from './routes/authRouter.js';
import { handlebarsConf } from './config/handlebarsConfig.js';
import { socketConf } from './config/socketConfig.js';
import { passportConfig } from './config/passportConfig.js';
import { passportJwtConfig } from './config/passportJwtConfig.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

passportConfig(app);
passportJwtConfig(app);

handlebarsConf(app);

const httpServer = app.listen(8080, () => console.log('Servidor en el puerto 8080'));
const io = socketConf(httpServer);

app.use((req, res, next) => {
    req.io = io;
    res.locals.user = req.user;
    next();
});

mongoose.connect('', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/', viewRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/auth', authRouter);

export { app };
