import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { deleteMessage, getConversation, getMessages, markAsRead, sendMessage } from '../controllers/chatController.js';
import { multerMiddleware } from '../config/cloudinaryConfig.js';


export const chatRouter = express.Router();


chatRouter.post('/send-message',authMiddleware,multerMiddleware,sendMessage);//done
chatRouter.get('/get-conversations',authMiddleware,getConversation); //done
chatRouter.get('/conversations/:conversationId/messages',authMiddleware,getMessages);
chatRouter.delete('/delete-message',authMiddleware,deleteMessage);//ok
chatRouter.put('/mark-as-read',authMiddleware,markAsRead);//ok

