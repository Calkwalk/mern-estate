import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { updateUser, deleteUser, getUserListing, getUserInfo } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

router.get('/listing/:id', verifyToken, getUserListing);
router.get('/id/:id', verifyToken, getUserInfo);

export default router;