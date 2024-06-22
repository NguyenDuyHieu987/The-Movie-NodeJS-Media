import apicache from 'apicache';
import createHttpError from 'http-errors';
import videosRouter from './video.route.js';
import imageRouter from './image.route.js';
import ErrorHandler from '../controllers/error.controller.js';
import { proxyHandler } from '../middlewares/index.js';
import RedisCache from '../config/redis/index.js';

const cacheWithRedis = apicache.options({
  redisClient: RedisCache,
}).middleware;

export default function route(app) {
  app.use('/images', cacheWithRedis('1 hours'), imageRouter.Get);
  app.use('/videos', cacheWithRedis('2 hours'), videosRouter.Get);
  app.use(proxyHandler);
  app.use('/image', imageRouter.Service);
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
