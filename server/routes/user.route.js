import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'api/userRouter'
    })
});

router.get('/test', (req, res) => {
    res.json({
        message: 'test ok'
    })
});

export default router;