import { createLogger, transports, format } from 'winston';

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.timestamp(),
        format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

export default logger;
