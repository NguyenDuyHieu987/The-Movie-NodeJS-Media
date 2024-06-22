import createHttpError from 'http-errors';
import videosRouter from './video.route.js';
import imageRouter from './image.route.js';
import ErrorHandler from '../controllers/error.controller.js';

export default function route(app) {
  app.use('/image', imageRouter);
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
