import express from 'express';
import { signup, signout, signin } from '../controllers/auth.controller.js';

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "auth",
        data: {}
    })
});

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

export default router;