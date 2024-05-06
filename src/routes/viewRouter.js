import { Router } from 'express';

export const viewRouter = Router();

viewRouter.get('/', async (req, res) => {
	const response = await fetch('http://localhost:8080/api/products');
	const data = await response.json();
	res.render('home', {
		products: data.payload,
	});
});

viewRouter.get('/realtimeproducts', async (req, res) => {
    const response = await fetch('http://localhost:8080/api/products');
    const data = await response.json();
    res.render('realtimeproducts', {
        products: data.products, 
    });
});