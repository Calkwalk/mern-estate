import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import db from '../mysql/dbhelper.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const id = uuid();

    db.query('INSERT INTO Users (id, username, email, password) VALUES (?, ?, ?, ?)', [id, username, email, hashedPassword], (err, _) => {
        if (err) return next(err)
        res.json({
            success: true,
            message: 'User has been created.',
            data: { username, email }
        })
    });
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    db.query('SELECT id, username, email, password FROM Users WHERE email=? LIMIT 1', [email], (err, users) => {
        if (err) {
            next(err)
        } else {
            if (users.length == 0) return next(errorHandler(404, 'User no found!'))

            // check password
            const validUser = users[0];
            const validPassword = bcryptjs.compareSync(password, validUser.password)
            if (!validPassword) return next(errorHandler(401, 'Wrong Credentials(email or password)!'))

            // token
            const token = jwt.sign(
                { id: validUser.id },
                process.env.JWT_SECRET || 'FtAfnEnoLaXXQrYO'
            )

            // res.cookie('access_token', token, { httpOnly: true, expires: new Date(Datae.now() + 24 * 60 * 60 * 1000) })
            res.cookie('access_token', token, { httpOnly: false }).status(200).json({
                success: true,
                message: 'user has been authed.',
                data: { id: validUser.id, username: validUser.username, email: validUser.email, token }
            })
        }
    });
}

export const signout = async (req, res, next) => {

    try {
        res.clearCookie('access_token');
        res.status(200).json({
            success: true,
            message: 'User has been logged out!',
            data:null
        });
      } catch (error) {
        next(error);
      }
};