import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

class VideoServiceController {
  upload(req, res, next) {
    try {
      res.json();
    } catch (error) {
      next(error);
    } finally {
    }
  }
}

export default new VideoServiceController();
