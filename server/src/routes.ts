import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const upload = multer(multerConfig);
const pointsContoller = new PointsController();
const itemsController = new ItemsController();

//nomeclaturas defaults
//index, show , create,  update, delete

routes.get('/items', itemsController.index);

routes.get('/points',  pointsContoller.index);
routes.get('/points/:id',  pointsContoller.show);

routes.post('/points', upload.single('image'), pointsContoller.create);

export default routes;