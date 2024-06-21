import createHttpError from 'http-errors';
import videoRouter from './video.js';
import imageRouter from './image.js';
import ErrorHandler from '../controllers/errorController.js';

export default function route(app) {
  app.use('/videos', videoRouter);
  app.use('/images', imageRouter);
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
