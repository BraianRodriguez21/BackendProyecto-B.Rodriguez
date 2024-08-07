import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console({
            level: 'debug',
            format: combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({ filename: 'errors.log', level: 'error' })
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'exceptions.log' })
    ]
});

if (process.env.NODE_ENV === 'production') {
    logger.level = 'info';
    logger.remove(new transports.Console());
}

export default logger;
