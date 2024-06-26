import express from 'express';
import mongoose from 'mongoose';
import { config } from './config/config.js';
import session from 'express-session';
import passport from './config/passportConfig.js';
import jwtPassport from './config/passportJwtConfig.js';
import { handlebarsConf } from './config/handlebarsConfig.js';
import { socketConf } from './config/socketConfig.js';
import { userRouter } from './routes/userRouter.js';
import { productRouter } from './routes/productRouter.js';
import { cartRouter } from './routes/cartRouter.js';
import { viewRouter } from './routes/viewRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(jwtPassport.initialize());

const httpServer = app.listen(config.port, () => console.log(`Servidor en el puerto ${config.port}`));

handlebarsConf(app);

const io = socketConf(httpServer);

app.use((req, res, next) => {
    req.io = io;
    res.locals.user = req.user;
    next();
});

mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/', viewRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/auth', userRouter);

export { app };
