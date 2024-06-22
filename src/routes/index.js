import createHttpError from 'http-errors';
import videosRouter from './video.route.js';
import imageRouter from './image.route.js';
import ErrorHandler from '../controllers/error.controller.js';

export default function route(app) {
  app.use((req, res, next) => {
    const proxyAuthHeader = req.headers['x-proxy-auth'];
    const apiKey = req.headers['x-api-key'];
    const requestIP = req.ip || req.connection.remoteAddress;
    console.log(requestIP);

    if (
      proxyAuthHeader !== 'my-proxy-key'
      // apiKey !== validApiKey ||
      // requestIP !== allowedProxyIP
      // process.env.NODE_ENV == 'production'
    ) {
      return res.status(403).send('Forbidden: Access is denied.');
    }

    next();
  });
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
