import express from 'express';
import { signup, signout } from '../controllers/auth.controller.js';

const router = express.Router();

router.get("/", (req, res) => {
    res.json({message: "auth"})
})

router.post('/signup', signup);

router.get('/signout', signout);

export default router;