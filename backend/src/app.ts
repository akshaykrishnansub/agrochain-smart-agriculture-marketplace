import type{Application } from 'express';
import express from 'express'
import cors from 'cors';
import "dotenv/config"
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/fileRoutes.js'
import userRoutes from './routes/userRoutes.js'

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const app:Application=express();
const frontendPath=path.resolve(__dirname,'../../frontend/dist');

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookieParser());

app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/upload',uploadRoutes)
app.use('/api/users',userRoutes);

app.use(express.static(frontendPath));

app.get(/.*/,(req,res)=>{
    res.sendFile(path.join(frontendPath,'index.html'))
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