import db from '../mysql/dbhelper.js';


export const createListing = (req, res, next) => {
    const { userId, listName, description, address, types, beds, baths, price } = req.body;

    // res.json({ userId, listName, description, address, types, beds, baths, price });

    db.query('INSERT INTO Lists ( user_id, list_name, description, address, types, beds, baths, price ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
            userId, listName, description, address, JSON.stringify(types), beds, baths, price
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
    db.query('DELETE FROM Lists WHERE id = ?', req.params.id, (err, _) => {
        if (err) return next(err);

        res.json({
            success: true,
            message: 'Listing has been deleted.',
            data: null
        })
    })
};