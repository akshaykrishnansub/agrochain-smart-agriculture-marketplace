import type{Application } from 'express';
import express from 'express'
import cors from 'cors';
import "dotenv/config"
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import productRoutes from './routes/productRoutes.js'

const app:Application=express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)

app.get("/",(req,res)=>{
    res.json({
        message:"Agrochain API running"
    })
})



const PORT=process.env.PORT || 5000;


connectDB()
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((err)=>{
        console.error("MongoDB connection error",err);
        process.exit(1);
    })