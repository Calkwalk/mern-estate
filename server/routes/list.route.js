import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createListing, deleteListing, getListing, updateListing } from '../controllers/list.controller.js';

const router = express.Router();

router.post('/create/', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id',verifyToken, updateListing);
router.get('/:id', verifyToken, getListing);
export default router;