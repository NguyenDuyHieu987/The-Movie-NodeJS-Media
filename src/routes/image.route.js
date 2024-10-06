import express from 'express';
import Image from '../controllers/images.controller.js';
import ImageService from '../controllers/imageService.controller.js';
import { uploadImage, uploadArrayImage } from '../utils/storage.js';

const Get = express.Router();

Get.get('/:type/*', Image.Get);

const Service = express.Router();

Service.post(
  '/upload',
  // uploadImage.single('image'),
  ImageService.upload
);

// Service.post(
//   '/upload',
//   uploadArrayImage.array('images', 10),
//   ImageService.upload
// );

export default { Get, Service };
