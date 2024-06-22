import express from 'express';
import Image from '../controllers/imageService.controller.js';

const router = express.Router();

router.post('/upload', Image.upload);

export default router;
