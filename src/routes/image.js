import express from 'express';
import Image from '../controllers/imageController.js';

const router = express.Router();

router.get('/:type/:name', Image.get);

export default router;
