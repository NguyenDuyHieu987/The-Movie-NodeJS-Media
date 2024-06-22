import createHttpError from 'http-errors';
import videosRouter from './video.route.js';
import imageRouter from './image.route.js';
import ErrorHandler from '../controllers/error.controller.js';
import { proxyHandler } from '../middlewares/index.js';

export default function route(app) {
  app.use('/images', imageRouter.Get);
  app.use(proxyHandler);
  app.use('/image', imageRouter.Service);
  app.use('/videos', videosRouter.Get);
  app.use('/video', videosRouter.Service);
  app.all('*', (req, res, next) => {
    return next(
      createHttpError(
        404,
        `Can't find the route: ${req.originalUrl} on server!`
      )
    );
  });
  app.use(ErrorHandler);
}
