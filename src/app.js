import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';
import { viewRouter } from './routes/viewRouter.js';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRoutes.js'; 
import { handlebarsConf } from './config/handlebarsConfig.js';
import { socketConf } from './config/socketConfig.js';
import { errorHandler } from './middleware/errorHandler.js';
import { swaggerUi, specs } from './config/swaggerConfig.js';
import './config/passportConfig.js'; 
import logger from './config/loggerConfig.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

handlebarsConf(app);

const httpServer = app.listen(config.port || 8080, () => logger.info(`Servidor en el puerto ${config.port || 8080}`));
const io = socketConf(httpServer);

app.use((req, res, next) => {
    req.io = io;
    next();
});

mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => logger.info('MongoDB conectado'))
.catch(err => logger.error('Error de conexión a MongoDB:', err));

app.use('/', viewRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/auth', userRouter);
app.use('/api/users', userRouter);  // Consolidating user-related routes here

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

app.get('/loggerTest', (req, res) => {
    logger.debug('Debug log');
    logger.http('HTTP log');
    logger.info('Info log');
    logger.warn('Warning log');
    logger.error('Error log');
    logger.fatal('Fatal log');
    res.send('Logs have been generated');
});

export { app };
