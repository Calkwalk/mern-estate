import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { uploadFile, upload, removeFile, uploadFiles } from '../controllers/file.controller.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.post('/uploads', upload.array('files', 6), uploadFiles);
router.post('/remove', removeFile);

export default router;