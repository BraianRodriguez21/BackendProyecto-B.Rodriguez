import { engine } from 'express-handlebars';

export const handlebarsConf = (app) => {
	app.engine('hbs', engine({ extname: 'hbs' }));
	app.set('views', 'src/views');
	app.set('view engine', 'hbs');
};