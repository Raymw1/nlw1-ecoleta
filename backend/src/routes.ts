import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import PointsControler from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();

const upload = multer(multerConfig);

routes.get('/items', ItemsController.index);
routes.get('/points', PointsControler.index);
routes.get('/points/:id', PointsControler.show);
routes.post('/points', upload.single('image'), PointsControler.store);

export default routes;
