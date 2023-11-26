import multer from 'multer';
import fs from 'fs';
import db from '../mysql/dbhelper.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/assets/upload');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
export const upload = multer({ storage });

export const uploadFile = (req, res) => {
    res.status(201).json({
        success: true,
        message: 'file has been uploaded',
        data: req.file
    });
};

export const uploadFiles = (req, res) => {
    if (req.body.listId) {
        const listId = req.body.listId[0];
        const images = JSON.stringify(req.files)

        db.query('UPDATE Lists SET images = ? WHERE id = ?', [images, listId], (err, _) => {
            if (err) return next(err)
            res.status(201).json({
                success: true,
                message: 'Images updated',
                data: { id: listId, images: req.files }
            })
        })
    } else {
        res.status(201).json({
            success: true,
            message: 'files has been uploaded',
            data: req.files
        });
    }

};

export const removeFile = async (req, res, next) => {
    const { fileName } = req.body;
    const path = 'public\\assets\\upload\\'
    console.log(fileName)
    fs.unlink(path + fileName, (err) => {
        if (err) next(err)
        res.json({
            success: true,
            message: 'file has been removed',
            data: null
        })
    });
}