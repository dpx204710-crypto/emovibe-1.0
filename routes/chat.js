import express from 'express';
import { getMessages, postMessage } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:chatId', authMiddleware, getMessages);
router.post('/:chatId', authMiddleware, postMessage);

export default router;
