import db from '../mysql/dbhelper.js';
import fs from 'fs';
import { errorHandler } from '../utils/error.js';
import { jsonToHump } from '../utils/hump.js';


export const createListing = (req, res, next) => {
    const userId = req.user.id;
    const { listName, description, address, listType, benefit, beds, baths, price, offerPrice } = req.body;

    db.query('INSERT INTO Lists ( user_id, list_name, description, address, list_type, benefit, beds, baths, price, offer_price ) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            userId, listName.substr(0, 255), description.substr(0, 1024), address.substr(0,255), listType, JSON.stringify(benefit), beds, baths, price, offerPrice
        ], (err, result) => {
            if (err) return next(err)
            res.json({
                success: true,
                message: 'List has been created.',
                data: { id: result.insertId }
            })
        });
};

export const deleteListing = async (req, res, next) => {
    const id = req.params.id
    db.getConnection((err, connection) => {
        if (err) next(err);
        // 1 find listing
        connection.query('SELECT user_id, images FROM Lists WHERE id = ? limit 1', id, (err, result) => {
            if (err) next(err);

            const existListing = jsonToHump(result);
            if (existListing.length > 0) {
                const currentListing = existListing[0];

                // 2 check owner
                if (req.user.id !== currentListing.userId) {
                    res.json(errorHandler(403, 'You can only delete your own listing'))
                }

                // 3 delete
                connection.query('DELETE FROM Lists WHERE id = ?', id, (err, result) => {
                    connection.release();
                    if (err) next(err)

                    // remove images of listing
                    if (currentListing.images !== null) {
                        const path = 'public\\assets\\upload\\'
                        const images = JSON.parse(currentListing.images)
                        images.forEach(image => {
                            fs.unlink(path + image.filename, (err) => {
                                if (err) next(err)
                            });
                        });
                    }

                    res.json({
                        success: true,
                        message: 'Delete list completed',
                        data: { id }
                    });
                });

            } else {
                connection.release();
                res.json(errorHandler(404, 'Listing not found'))
            }

        });
    })
    // db.query('DELETE FROM Lists WHERE id = ?', req.params.id, (err, _) => {
    //     if (err) return next(err);

    //     res.json({
    //         success: true,
    //         message: 'Listing has been deleted.',
    //         data: null
    //     })
    // })
};

export const updateListing = (req, res, next) => {
    const id = req.params.id;
    const { listName, description, address, listType, benefit, beds, baths, price, offerPrice } = req.body;
    db.getConnection((err, connection) => {
        if (err) next(err)

        // 1 find listing
        connection.query('SELECT user_id FROM Lists WHERE id = ? limit 1', id, (err, result) => {
            if (err) next(err);

            const existListing = jsonToHump(result);
            if (existListing.length > 0) {
                const currentListing = existListing[0];

                // 2 check owner
                if (req.user.id !== currentListing.userId) {
                    res.json(errorHandler(403, 'You can only update your own listing'))
                }

                // 3 update
                connection.query(
                    'UPDATE Lists SET list_name = ?, description = ?, address = ?, \
                    list_type = ?, benefit = ?, beds = ?, baths = ?, price = ?, offer_price = ?  WHERE id = ?',
                    [listName.substr(0, 255), description.substr(0, 1024), address.substr(0,255), listType, JSON.stringify(benefit), beds, baths, price, offerPrice, id], (err, result) => {
                        connection.release();

                        if (err){
                            // return next(err)
                            console.log(err);
                            next(err);
                        }

                        res.json({
                            success: true,
                            message: 'Update list completed',
                            data: { id }
                        });
                    });

            } else {
                connection.release();
                res.json(errorHandler(404, 'Listing not found'))
            }

        });
    });

};

export const getListing = (req, res, next) => {
    const id = req.params.id;
    db.getConnection((err, connection) => {
        if (err) next(err)

        // 1 find listing
        connection.query('SELECT * FROM Lists WHERE id = ? limit 1', id, (err, result) => {
            connection.release();

            if (err) next(err);

            const existListing = jsonToHump(result);
            if (existListing.length > 0) {
                const currentListing = existListing[0];

                // 2 check owner
                if (req.user.id !== currentListing.userId) {
                    res.json(errorHandler(403, 'You can only update your own listing'))
                } else {
                    res.json({
                        success: true,
                        message: 'Listing query success',
                        data: currentListing
                    });
                }

            } else {
                res.json(errorHandler(404, 'Listing not found'))
            }

        });
    });

};