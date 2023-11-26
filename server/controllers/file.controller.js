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
    if (req.body.listingId) {
        const listingId = Array.isArray(req.body.listingId) ? req.body.listingId[0] : req.body.listingId;
        let images = req.files;

        // console.log(listingId, images);

        db.getConnection((err, connection) => {
            if (err) next(err);

            connection.query('SELECT images FROM Lists WHERE id = ? limit 1', listingId, (err, result) => {
                if (result.length > 0 && result[0].images !== null) {
                    const originImages = JSON.parse(result[0].images);
                    images = [...originImages, ...images]
                }

                connection.query('UPDATE Lists SET images = ? WHERE id = ?', [JSON.stringify(images), listingId], (err, _) => {
                    connection.release();
                    if (err) return next(err);
                    res.status(201).json({
                        success: true,
                        message: 'Images updated',
                        data: { id: listingId, images: req.files }
                    });
                })
            })
        });


    } else {
        console.log('not update listing')
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