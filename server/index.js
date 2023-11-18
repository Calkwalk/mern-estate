import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from 'mongoose';
import cors  from "cors";
import * as dotenv  from "dotenv";

import * as path from 'node:path';
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

dotenv.config();

/* CONFIGURATION */
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("command"));
app.use(cors());

/* ROUTES */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.post("/", (req,res) => res.status(200).json({message: 'OK'}) );

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// 404
// app.post('*', (req,res) => res.status(200).json({message: 'Data Not Found'}));
// app.get("*", (req, res) => res.status(404).sendFile(__dirname+"/public/404.html" ))


/* MONGOOSE SETUP And Listen Server Post */
const PORT = process.env.SERVER_PORT || 5001;
const HOST = process.env.SERVER_URL || 'http://localhost'

app.listen(PORT, () => {
    console.log(`Server is runing on: ${HOST}:${PORT}`);
});


// mongoose.connect(
//     process.env.MONGO_DB_URL
// ).then(() =>{
//     app.listen(PORT, () => {
//         console.log(`Server is runing on: ${HOST}/${PORT}`);
//     });

// }).catch((error) => {
//     console.log(error);
// });