import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from "morgan";
import routeIndex from './routes/index.js';

const app = express();
dotenv.config();
app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("working");
})

app.use('/api/v1', routeIndex)

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to db..");
})

app.listen(8000, () => {
    console.log("server running on port 8000");
})
