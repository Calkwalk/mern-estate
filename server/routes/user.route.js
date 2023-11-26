import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { updateUser, deleteUser, getUserListing } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

router.get('/listing/:id', getUserListing)

export default router;