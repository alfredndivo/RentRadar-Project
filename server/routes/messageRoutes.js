import express from 'express';
import {
  sendMessage,
  getMessagesWithUser,
  getRecentChats
} from '../controllers/messageController.js';
import { authorize } from '../middleware/authMiddleware.js';
import uploadMessageImage from '../middleware/uploadMessageImage.js';

const router = express.Router();

// 💌 Send message (with optional image)
router.post(
  '/',
  authorize,
  uploadMessageImage.single('image'),
  sendMessage
);

// 💬 Get conversation with another user
router.get('/:userId', authorize, getMessagesWithUser);

// 📥 Get recent chat previews
router.get('/recent', authorize, getRecentChats);

export default router;
