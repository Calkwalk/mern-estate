import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createListing, deleteListing, getListingById, updateListing, getListings } from '../controllers/list.controller.js';

const router = express.Router();

router.post('/create/', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id',verifyToken, updateListing);
router.get('/search', getListings);
router.get('/id/:id', getListingById);

export default router;