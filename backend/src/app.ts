import express from 'express';
import cors from 'cors';
import "dotenv/config"
import connectDB from './config/db.js';

const app=express();

app.use(express.json());
app.use(cors());

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