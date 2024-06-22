import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import RedisCache from '../config/redis/index.js';

const __dirname = path.resolve();

class ImageController {
  async Get(req, res, next) {
    try {
      const { type } = req.params;
      const name = req.params[0];
      const { w, h } = req.query;

      const imagePath = path.join(__dirname, 'src/public/images', type, name);

      if (!fs.existsSync(imagePath)) {
        return next(createHttpError.NotFound('Image not found'));
      }

      const cacheKey = req.originalUrl || `${type}-${name}-${w}x${h}`;
      const cachedImage = await RedisCache.redisClient().get(cacheKey);

      if (cachedImage) {
        res.type('image/jpeg');
        return res.send(Buffer.from(cachedImage, 'binary'));
      }

      const image = sharp(imagePath);
      const metadata = await image.metadata();

      let resizedImageBuffer;
      if (w && h) {
        resizedImageBuffer = await image
          .resize(parseInt(w), parseInt(h))
          .toBuffer();
      } else if (w) {
        const newWidth = parseInt(w);
        const newHeight = Math.round(
          (newWidth / metadata.width) * metadata.height
        );
        resizedImageBuffer = await image.resize(newWidth, newHeight).toBuffer();
      } else if (h) {
        const newHeight = parseInt(h);
        const newWidth = Math.round(
          (newHeight / metadata.height) * metadata.width
        );
        resizedImageBuffer = await image.resize(newWidth, newHeight).toBuffer();
      } else {
        resizedImageBuffer = await image.toBuffer();
        // return res.sendFile(imagePath);
      }

      RedisCache.redisClient().setEx(
        cacheKey,
        +process.env.REDIS_CACHE_IMAGE_TIME,
        resizedImageBuffer.toString('binary')
      );

      res.type('image/jpeg');
      res.send(resizedImageBuffer);
    } catch (err) {
      // res.status(500).send(`Something went wrong.<br/>${err}`);
      next(err);
    }
  }
}

export default new ImageController();
