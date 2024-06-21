import createHttpError from 'http-errors';
import path from 'path';
import fs from 'fs';
// global.self = global;
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class VideoController {
  get(req, res, next) {
    try {
      const name = req.params.name;
      const range = req.headers.range;

      // if (!range) {
      //   next(createHttpError.InternalServerError('Requires Range header'));
      // }

      // const videoDirectory = `src/public/videos/${req.params.type}`;

      const videoDirectory = path.join(
        'src',
        // __dirname,
        // '..',
        'public',
        'videos',
        req.params.type
      );

      let videoPath = path.join(videoDirectory, name);

      const partsName = name.split('.');
      const videoFormat = partsName[1] || 'mp4';

      if (videoFormat == 'm3u8' || videoFormat == 'ts') {
        videoPath = `${videoDirectory}/${partsName[partsName?.length - 2]}/${
          partsName[partsName?.length - 2]
        }.${videoFormat}`;
      }

      if (!fs.existsSync(videoPath)) {
        return res.status(404).send('Video not found');
      }

      res.setHeader('Content-Type', 'video/application/vnd.apple.mpegurl');
      res.setHeader('Content-Disposition', 'inline');
      fs.createReadStream(videoPath).pipe(res);

      // let videoSize = 0;

      // videoSize = fs.statSync(videoPath).size;

      // if (range) {
      //   const parts = range.replace(/bytes=/, '').split('-');
      //   const CHUNK_SIZE = 1024 * 1024; // 1 MB
      //   // const start = Number(range.replace(/\D/g, ''));
      //   // const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      //   const start = Number(parts[0]);
      //   const end = parts[1]
      //     ? Number(parts[1])
      //     : Math.min(start + CHUNK_SIZE, videoSize - 1);

      //   const contentLength = end - start + 1;
      //   const headers = {
      //     'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      //     'Accept-Ranges': 'bytes',
      //     'Content-Length': contentLength,
      //     'Content-Type': 'video/mp4',
      //   };

      //   res.writeHead(206, headers);
      //   const videoStream = fs.createReadStream(videoPath, { start, end });
      //   videoStream.pipe(res);
      // } else {
      //   const head = {
      //     'Content-Length': videoSize,
      //     'Content-Type': 'video/mp4',
      //   };

      //   res.writeHead(200, head);
      //   fs.createReadStream(videoPath).pipe(res);
      // }
    } catch (error) {
      next(error);
    } finally {
    }
  }

  getWwildcard(req, res, next) {
    try {
      const name = req.params[0];
      const range = req.headers.range;

      let videoSize = 0;

      const partsName = name.split('.');
      const videoFormat = partsName[partsName?.length - 1] || 'mp4';

      // return res.sendFile(`/videos/${partsName[0]}.${videoFormat}`, {
      //   root: 'src/public',
      // });

      const videoPath = `src/public/videos/${
        partsName[partsName?.length - 2]
      }.${videoFormat}`;

      videoSize = fs.statSync(videoPath).size;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const CHUNK_SIZE = 1024 * 1024; // 1 MB
        // const start = Number(range.replace(/\D/g, ''));
        // const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
        const start = Number(parts[0]);
        const end = parts[1]
          ? Number(parts[1])
          : Math.min(start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${videoSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': contentLength,
          'Content-Type': 'video/mp4',
        };
        // res.writeHead(206, headers);
        // const videoStream = fs.createReadStream(videoPath, { start, end });
        // videoStream.pipe(res);
        res.setHeader('Content-Type', 'video/application/vnd.apple.mpegurl');
        res.setHeader('Content-Disposition', 'inline');
        fs.createReadStream(videoPath).pipe(res);
      } else {
        const head = {
          'Content-Length': videoSize,
          'Content-Type': 'video/mp4',
        };
        // res.writeHead(200, head);
        res.setHeader('Content-Type', 'video/application/vnd.apple.mpegurl');
        res.setHeader('Content-Disposition', 'inline');
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      next(error);
    } finally {
    }
  }

  playback(req, res, next) {
    try {
      const name = req.params[0];
      const range = req.headers.range;

      const partsName = name.split('.');
      const videoFormat = partsName[1] || 'mp4';

      // return res.sendFile(`/videos/${partsName[0]}.${videoFormat}`, {
      //   root: 'src/public',
      // });

      const videoPath = `src/public/videos/${partsName[0]}.${videoFormat}`;

      let videoSize = 0;

      videoSize = fs.statSync(videoPath).size;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const CHUNK_SIZE = 1024 * 1024; // 1 MB
        // const start = Number(range.replace(/\D/g, ''));
        // const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
        const start = Number(parts[0]);
        const end = parts[1]
          ? Number(parts[1])
          : Math.min(start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${videoSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': contentLength,
          'Content-Type': 'video/mp4',
        };
        // res.writeHead(206, headers);
        // const videoStream = fs.createReadStream(videoPath, { start, end });
        // videoStream.pipe(res);
        res.setHeader('Content-Type', 'video/application/vnd.apple.mpegurl');
        res.setHeader('Content-Disposition', 'inline');
        fs.createReadStream(videoPath).pipe(res);
      } else {
        const head = {
          'Content-Length': videoSize,
          'Content-Type': 'video/mp4',
        };
        // res.writeHead(200, head);
        res.setHeader('Content-Type', 'video/application/vnd.apple.mpegurl');
        res.setHeader('Content-Disposition', 'inline');
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      next(error);
    } finally {
    }
  }
}

export default new VideoController();
