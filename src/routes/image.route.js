import express from 'express';
import Image from '../controllers/images.controller.js';
import ImageService from '../controllers/imageService.controller.js';

const Get = express.Router();

Get.get('/:type/*', Image.Get);

const Service = express.Router();

Service.post('/upload', ImageService.upload);

export default { Get, Service };
