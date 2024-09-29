import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import {
  generateRandomString,
  getFormattedNumberDateTime,
} from '../utils/index.js';
import SocketService from '../config/websocket/index.js';

const __dirname = path.resolve();

class VideoServiceController {
  async upload(req, res, next) {
    try {
      const extName = path.extname(req.file.filename);
      const fileName = req.file.filename.replace(extName, '');
      const originalFileName = req.file.originalname.replace(extName, '');

      const videoPath = req.file.path;

      const outputDir = path.join(
        __dirname,
        `src/public/videosTest`,
        // `${getFormattedNumberDateTime({ from: 'day', to: '-' })}`,
        `${originalFileName}` +
          '_' +
          getFormattedNumberDateTime({ to: 'seconds' })
      );

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Dùng FFmpeg để chuyển đổi video MP4 sang HLS (.m3u8 và .ts)
      const ffmpegTool = ffmpeg(videoPath);

      if (process.env.NODE_ENV == 'development') {
        ffmpegTool.setFfmpegPath(
          'C:\\Users\\ddom6\\Downloads\\ffmpeg-2024-09-19-git-0d5b68c27c-full_build\\bin\\ffmpeg.exe'
        );
      }

      ffmpegTool
        .output(
          `${outputDir}/${originalFileName}_${generateRandomString(20)}_.m3u8`
        )
        .addOptions([
          '-profile:v baseline', // Tương thích cho phát trực tuyến
          '-level 3.0',
          '-start_number 0',
          '-hls_time 1', // Mỗi phân đoạn có thời lượng 10 giây
          '-hls_list_size 0', // Lưu toàn bộ danh sách
          '-f hls', // Định dạng đầu ra là HLS
        ])
        .on('progress', (progress) => {
          const percent = (progress.percent || 0).toFixed(2);
          SocketService.emitToAll('upload-video-progress', {
            percent: +percent,
          });
        })
        .on('end', () => {
          res.json({
            success: true,
            message: 'Video uploaded successfully!',
            file: req.file,
          });
        })
        .on('error', (err) => {
          res.json({
            success: false,
            message: 'Video upload failed!',
          });
        })
        .run();
    } catch (error) {
      next(error);
    } finally {
    }
  }
}

export default new VideoServiceController();
