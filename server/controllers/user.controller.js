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
    const userId = req.params.id;
    if(req.user.id !== userId) {
        return next(errorHandler(401, 'Unauthorized'))
    }

    db.query('SELECT * FROM Lists WHERE user_id = ?', userId, (err, result) => {
        if (err) next(err);

        res.json({
            success: true,
            message: 'Listing query success',
            data: jsonToHump(result)
        });
    });
    
};

export const getUserInfo= async (req, res, next) => {
    const userId = req.params.id;

    console.log('userId', userId)

    db.query('SELECT * FROM Users WHERE id = ? limit 1', userId, (err, result) => {
        if (err) next(err);

        const existUsers = jsonToHump(result);
        if (existUsers.length > 0) {
            const currentUser = existUsers[0];

            res.json({
                success: true,
                message: 'Get User info completed',
                data: {
                    id: currentUser.id,
                    username: currentUser.username,
                    email: currentUser.email
                }
            });
        } else {
            res.json(errorHandler(404, 'User not found'))
        }
    });
}