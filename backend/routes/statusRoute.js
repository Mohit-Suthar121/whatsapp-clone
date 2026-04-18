
import express from 'express'
import { createStatus, deleteStatus, getStatus, viewStatus } from '../controllers/statusController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { multerMiddleware } from '../config/cloudinaryConfig.js';

export const statusRouter = express.Router();


statusRouter.post('/create-status',authMiddleware,multerMiddleware,createStatus)
statusRouter.get('/get-status',authMiddleware,getStatus)
statusRouter.get('/view-status/:statusId',authMiddleware,viewStatus)
statusRouter.delete('/delete-status/:statusId',authMiddleware,deleteStatus)


