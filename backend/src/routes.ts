import express from 'express';

import PointsControler from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();

routes.get('/items', ItemsController.index);
routes.get('/points', PointsControler.index);
routes.get('/points/:id', PointsControler.show);
routes.post('/points', PointsControler.store);

export default routes;
