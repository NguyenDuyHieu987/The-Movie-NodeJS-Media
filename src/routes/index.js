import apicache from 'apicache';
import createHttpError from 'http-errors';
import videosRouter from './video.route.js';
import imageRouter from './image.route.js';
import middleware, { proxyHandler } from '../middlewares/index.js';
import RedisCache from '../config/redis/index.js';

let cache = apicache.middleware;

const cacheWithRedis = apicache.options({
  redisClient: RedisCache.redisClient(),
}).middleware;

if (process.env.NODE_ENV == 'development') {
  cache = cacheWithRedis;
}

export default function route(app) {
  app.use(
    '/images',
    cache(`${parseInt(process.env.REDIS_CACHE_IMAGE_TIME / 60)} minutes`),
    imageRouter.Get
  );
  app.use(
    '/videos',
    cache(process.env.REDIS_CACHE_VIDEO_TIME?.toString()),
    videosRouter.Get
  );
  // app.use(proxyHandler);
  middleware(app, () => {
    app.use('/image', imageRouter.Service);
    app.use('/video', videosRouter.Service);
  });
  app.all('*', (req, res, next) => {
    return next(
      createHttpError(
        404,
        `Can't find the route: ${req.originalUrl} on server!`
      )
    );
  });
}
