import express from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const pointsContoller = new PointsController();
const itemsController = new ItemsController();

//nomeclaturas defaults
//index, show , create,  update, delete

routes.get('/items', itemsController.index);

routes.post('/points',  pointsContoller.create);
routes.get('/points',  pointsContoller.index);
routes.get('/points/:id',  pointsContoller.show);

export default routes;