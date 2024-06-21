import express from 'express';
import Video from '../controllers/videoController.js';

const router = express.Router();

router.get('/:type/:name', Video.get);
router.get('/playback/*', Video.playback);
router.get('/*', Video.getWwildcard);

export default router;
