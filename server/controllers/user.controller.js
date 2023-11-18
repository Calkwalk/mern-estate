import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'api/userController'
    })
});

router.post('/signin', (req, res) => {
    res.json({
        message: 'api/userController'
    })
});

export default router;