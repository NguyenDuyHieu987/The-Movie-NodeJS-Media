import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import util from 'util';
import slugify from 'slugify';
import {
  generateRandomString,
  getFormattedNumberDateTime,
  sanitizeFileName,
} from '../utils/index.js';
import SocketService from '../config/websocket/index.js';
import { uploadVideo } from '../utils/storage.js';

const __dirname = path.resolve();

const uploadFile = util.promisify(uploadVideo.single('video'));

class VideoServiceController {
  async upload(req, res, next) {
    try {
      const folder =
        req.body?.folder || req.params?.folder || req.query?.folder;

      if (!folder) {
        return next(createHttpError(500, 'Please provide folder'));
      }

      await uploadFile(req, res);

      const extName = path.extname(req.file.filename);
      const fileName = req.file.filename.replace(extName, '');
      const originalFileName = slugify(
        req.file.originalname.replace(extName, '').replaceAll(' ', '_')
      );

      const videoPath = req.file.path;

      const videoDirectory = path.join(
        // `${getFormattedNumberDateTime({ from: 'day', to: '-' })}`,
        `${originalFileName}` +
          '_' +
          getFormattedNumberDateTime({ to: 'seconds' })
      );

      const outputDir = path.join(
        __dirname,
        `src/public/videos/${folder}`,
        videoDirectory
      );

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Dùng FFmpeg để chuyển đổi video MP4 sang HLS (.m3u8 và .ts)
      const ffmpegTool = ffmpeg(videoPath);

      if (process.env.NODE_ENV == 'development') {
        ffmpegTool.setFfmpegPath(
          'C:\\Users\\ddom6\\Downloads\\ffmpeg-2024-09-19-git-0d5b68c27c-full_build\\bin\\ffmpeg.exe'
          // 'C:\\Users\\ddom6\\Downloads\\ffmpeg-7.1-full_build\\bin\\ffmpeg.exe'
        );
        ffmpegTool.setFfprobePath(
          'C:\\Users\\ddom6\\Downloads\\ffmpeg-2024-09-19-git-0d5b68c27c-full_build\\bin\\ffprobe.exe'
        );
      }

      const videoName = `${originalFileName}_${generateRandomString(20)}_.m3u8`;

      ffmpegTool.ffprobe((err, metadata) => {
        if (err) {
          console.error('Error reading video metadata:', err);
          return;
        }
        req.file.metadata = metadata;
        req.file.duration = metadata.format.duration;

        // const timestamps = Array.from(
        //   { length: Math.ceil(metadata.format.duration) },
        //   (_, i) => i
        // );

        // ffmpegTool.thumbnails({
        //   timestamps: [1],
        //   filename: `preview_%s.jpg`,
        //   folder: path.join(__dirname, `src/public/imagesTest/still1`),
        //   size: '320x240',
        // });

        ffmpegTool
          .output(`${outputDir}/${videoName}`)
          .addOptions([
            '-profile:v baseline', // Tương thích cho phát trực tuyến
            '-level 3.0',
            '-start_number 0',
            '-hls_time 1', // Mỗi phân đoạn có thời lượng 10 giây
            '-hls_list_size 0', // Lưu toàn bộ danh sách
            '-f hls', // Định dạng đầu ra là HLS
          ])
          // .screenshot({
          //   timestamps: [1],
          //   filename: `preview_%s.jpg`,
          //   folder: path.join(__dirname, `src/public/imagesTest/still1`),
          //   size: '320x240',
          // })
          // .screenshots({
          //   timestamps: [0, 1, 2],
          //   filename: `preview_%s.jpg`,
          //   folder: path.join(__dirname, `src/public/imagesTest/preview`),
          //   size: '320x240',
          // })
          .on('progress', (progress) => {
            const percent = (progress.percent || 0).toFixed(2);
            SocketService.emitToAll('upload-video-progress', {
              percent: +percent,
            });
          })
          .on('end', async () => {
            res.json({
              success: true,
              message: 'Video uploaded successfully!',
              file: req.file,
              video_path: `${folder}/${videoDirectory}/${videoName}`,
            });
          })
          .on('error', (err) => {
            console.error(err);

            res.json({
              success: false,
              message: 'Video upload failed!',
            });
          })
          .run();
      });
    } catch (error) {
      next(error);
    } finally {
    }
  }
}

export default new VideoServiceController();
