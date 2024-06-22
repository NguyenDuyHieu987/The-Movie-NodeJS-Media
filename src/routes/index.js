import apicache from 'apicache';
import createHttpError from 'http-errors';
import videosRouter from './video.route.js';
import imageRouter from './image.route.js';
import ErrorHandler from '../controllers/error.controller.js';
import { proxyHandler } from '../middlewares/index.js';
import RedisCache from '../config/redis/index.js';

const cache = apicache.middleware;

const cacheWithRedis = apicache.options({
  redisClient: RedisCache,
}).middleware;

export default function route(app) {
  app.use(
    '/images',
    cache(`${parseInt(process.env.REDIS_CACHE_IMAGE_TIME / 3600)} hours`),
    imageRouter.Get
  );
  app.use(
    '/videos',
    cache(process.env.REDIS_CACHE_VIDEO_TIME),
    videosRouter.Get
  );
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
