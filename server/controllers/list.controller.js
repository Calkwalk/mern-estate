import db from '../mysql/dbhelper.js';
import fs from 'fs';
import { errorHandler } from '../utils/error.js';
import { jsonToHump } from '../utils/hump.js';


export const createListing = (req, res, next) => {
    const userId = req.user.id;
    const { listName, description, address, listType, amenities, beds, baths, price, offerPrice } = req.body;

    db.query('INSERT INTO Lists ( user_id, list_name, description, address, list_type, amenities, beds, baths, price, offer_price ) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            userId, listName.substr(0, 255), description.substr(0, 1024), address.substr(0, 255), listType, JSON.stringify(amenities), beds, baths, price, offerPrice
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
    const { listName, description, address, listType, amenities, beds, baths, price, offerPrice } = req.body;
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
                    list_type = ?, amenities = ?, beds = ?, baths = ?, price = ?, offer_price = ?  WHERE id = ?',
                    [listName.substr(0, 255), description.substr(0, 1024), address.substr(0, 255), listType, JSON.stringify(amenities), beds, baths, price, offerPrice, id], (err, result) => {
                        connection.release();

                        if (err) {
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

export const getListingById = (req, res, next) => {
    const listingId = req.params.id

    db.query('SELECT * FROM Lists WHERE id = ? limit 1', listingId, (err, result) => {
        if (err) return next(err);
        const existListing = jsonToHump(result);
        if (existListing.length > 0) {
            const currentListing = existListing[0];

            res.json({
                success: true,
                message: 'Listing query success',
                data: currentListing
            });
        } else {
            res.json(errorHandler(404, 'Listing not found'))
        }

    })

};

export const getListings = (req, res, next) => {
    const { searchTerm, type, parking, furnished, offer, sort, order } = req.query;

    let criterias = [];
    let sqlPattern = ''
    if (searchTerm !== undefined) {
        sqlPattern = 'WHERE list_name LIKE ?';
        criterias.push('%' + searchTerm + '%');
    } else {
        sqlPattern = 'WHERE 1 = 1';
    }

    if(type !== undefined && type !== 'all') {
        sqlPattern = sqlPattern.concat(' And list_type = ?');
        criterias.push(type)
    }


    if(parking !== undefined && parking === 'true') {
        sqlPattern = sqlPattern.concat(' And JSON_CONTAINS(amenities, JSON_ARRAY(?))');
        criterias.push('parking')
    }

    if(furnished !== undefined && furnished === 'true') {
        sqlPattern = sqlPattern.concat(' And JSON_CONTAINS(amenities, JSON_ARRAY(?))');
        criterias.push('furnished')
    }

    if(offer !== undefined && offer === 'true') {
        sqlPattern = sqlPattern.concat(' And JSON_CONTAINS(amenities, JSON_ARRAY(?))');
        criterias.push('offer')
    }


    if(sort !== undefined) {
        sqlPattern = sqlPattern.concat(' Order By ??');
        criterias.push(sort)
    } else {
        sqlPattern.concat(' Order By id');
    }

    if(order !== undefined) {
        sqlPattern = sqlPattern.concat(' ' + order);
    } else {
        sqlPattern.concat(' desc');
    }

    // debug sql sentence
    // console.log('sqlPattern', sqlPattern)
    // console.log('criterias',criterias)

    db.query('SELECT * FROM Lists ' + sqlPattern, criterias, (err, result) => {
        if (err) return next(err);

        res.json({
            success: true,
            message: 'Listing query success',
            data: jsonToHump(result)
        });

    })

};