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
      const cropSize = req.query?.crop_size || 'auto';
      const quality = +req.query?.quality || 80;
      const format = req.query?.format || 'avif';

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

      if (!w && !h && format === 'jpg') {
        return res.sendFile(imagePath);
      }

      const image = sharp(imagePath, { unlimited: false });
      const metadata = await image.metadata();
      const sharpOption = {
        quality: quality,
        chromaSubsampling: '4:4:4',
        progressive: true,
        tile: true,
        pyramid: true,
      };

      let imageBuffer;
      if (w && h && cropSize.toLowerCase() == 'exactly') {
        imageBuffer = await image
          .resize({
            width: parseInt(w),
            height: parseInt(h),
            withoutEnlargement: true,
          })
          .toFormat(format, sharpOption)
          .toBuffer();
      } else if (w) {
        const newWidth = parseInt(w);
        const newHeight = Math.round(
          (newWidth / metadata.width) * metadata.height
        );
        imageBuffer = await image
          .resize({
            width: newWidth,
            height: newHeight,
            withoutEnlargement: true,
          })
          .toFormat(format, sharpOption)
          .toBuffer();
      } else if (h) {
        const newHeight = parseInt(h);
        const newWidth = Math.round(
          (newHeight / metadata.height) * metadata.width
        );
        imageBuffer = await image
          .resize({
            width: newWidth,
            height: newHeight,
            withoutEnlargement: true,
          })
          .toFormat(format, sharpOption)
          .toBuffer();
      } else {
        imageBuffer = await image.toFormat(format, sharpOption).toBuffer();
        // return res.sendFile(imagePath);
      }

      RedisCache.redisClient().setEx(
        cacheKey,
        +process.env.REDIS_CACHE_IMAGE_TIME,
        imageBuffer.toString('binary')
      );

      res.type('image/jpeg');
      res.send(imageBuffer);
    } catch (err) {
      // res.status(500).send(`Something went wrong.<br/>${err}`);
      next(err);
    }
  }
}

export default new ImageController();
