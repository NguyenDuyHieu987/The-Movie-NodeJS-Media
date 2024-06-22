import express from 'express';
import Video from '../controllers/videos.controller.js';
import VideoService from '../controllers/videoService.controller.js';

const Get = express.Router();

Get.get('/:type/*', Video.get);
Get.get('/*', Video.getWwildcard);

const Service = express.Router();

Service.post('/upload', VideoService.upload);

export default { Get, Service };
