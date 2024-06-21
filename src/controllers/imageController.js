import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

class ImageController {
  get(req, res, next) {
    try {
      const name = req.params.name;
      const range = req.headers?.range || '5';

      if (!range) {
        next(createHttpError.InternalServerError('Requires Range header'));
      }

      let videoPath = '';
      let videoSize = '';

      switch (req.params.type) {
        case 'poster':
          // res.sendFile(`/videos/feature/${name}`, { root: 'src/public' });

          videoPath = `src/public/videos/feature/${name}`;
          videoSize = fs.statSync(`src/public/videos/feature/${name}`).size;
          break;
        case 'backdrop':
          // res.sendFile(`/videos/television/${name}`, { root: 'src/public' });

          videoPath = `src/public/videos/television/${name}`;
          videoSize = fs.statSync(`src/public/videos/television/${name}`).size;
          break;
        default:
          return next(
            createHttpError.NotFound(
              `Video with type: ${req.params.type} is not found`
            )
          );
          break;
      }

      const CHUNK_SIZE = 10 ** 6;
      const start = Number(range.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const contentLength = end - start + 1;
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, headers);
      const videoStream = fs.createReadStream(videoPath, { start, end });
      videoStream.pipe(res);
    } catch (error) {
      next(error);
    } finally {
    }
  }
}

export default new ImageController();
