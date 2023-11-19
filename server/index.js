import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from 'mongoose';
import cors from "cors";
import * as dotenv from "dotenv";

import * as path from 'node:path';
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

import db from './mysql/dbhelper.js';


dotenv.config();

/* CONFIGURATION */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("tiny"));
app.use(cors({ 
    origin: ['http://localhost:5173'],
    credentials: true
 }));

/* ROUTES */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.post("/", (req, res) => res.status(200).json({ message: 'Calkwalk Estate API' }));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Middleware for error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});




// 404
app.post('*', (req, res) => res.status(404).json({ message: 'URL Not Found(404).' }));
app.get("*", (req, res) => res.status(404).sendFile(__dirname + "/public/404.html"))


/* MONGOOSE SETUP And Listen Server Post */
const PORT = process.env.SERVER_PORT || 5001;
const HOST = process.env.SERVER_URL || 'http://localhost'

// app.listen(PORT, () => {
//     console.log(`Server is runing on: ${HOST}:${PORT}`);
// });



// mongoose.connect(
//     process.env.MONGO_DB_URL
// ).then(() =>{
//     app.listen(PORT, () => {
//         console.log(`Server is runing on: ${HOST}/${PORT}`);
//     });

// }).catch((error) => {
//     console.log(error);
// });


db.getConnection((error, connection) => {
    if (error) {
        console.log('Database Connect Error:', error)
    } else {
        connection.release();
        console.log('Database Connected by user calkwalk.')
        app.listen(PORT, () => {
            console.log(`Server is runing on: ${HOST}/${PORT}`);
        });

    }
})

