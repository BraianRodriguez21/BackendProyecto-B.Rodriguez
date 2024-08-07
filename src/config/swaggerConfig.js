import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
definition: {
    openapi: '3.0.0',
    info: {
    title: 'E-commerce API',
    version: '1.0.0',
    description: 'API documentation for E-commerce project',
    },
    servers: [
        {
        url: 'http://localhost:8080', 
        },
    ],
    },
    apis: ['./routes/*.js'], s
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
