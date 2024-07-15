export class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};
