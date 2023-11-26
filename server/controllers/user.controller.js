import bcrypptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js"
import db from '../mysql/dbhelper.js';

import {jsonToHump} from '../utils/hump.js';

export const updateUser = (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account'));

    const id = req.params.id
    const { username, email, password } = req.body;

    try {
        const hashedPassword = bcrypptjs.hashSync(password, 10);

        db.query('UPDATE Users SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, hashedPassword, id], (err, _) => {
            if (err) return next(err)
            res.json({
                success: true,
                message: 'User has been updated.',
                data: { id, username, email }
            })
        })
    } catch (error) {
        next(error)
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
        return next(errorHandler(401, 'You can only delete your own account!'));
    db.query('DELETE FROM Users WHERE id = ?', req.user.id, (err, _) => {
        if (err) return next(err);

        res.clearCookie('access_token');
        res.json({
            success: true,
            message: 'User has been deleted.',
            data: null
        })
    })
};

export const getUserListing = async (req, res, next) => {

    // res.json({message: 'ok'})

    // if (req.user.id !== req.params.id)
    //     return next(errorHandler(401, 'You can only query your own account!'));

    db.query('SELECT * FROM Lists WHERE user_id = ?', req.params.id, (err, result) => {
        if (err) return next(err);
        res.json({
            success: true,
            message: 'Query data successed',
            data: jsonToHump(result)
        })
    })
};