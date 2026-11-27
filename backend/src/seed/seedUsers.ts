import "dotenv/config";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';

const seedUsers=async()=>{
    try{
        await connectDB();

        const users:{
            name:string|undefined;
            email:string|undefined;
            password:string|undefined;
            role:"admin"|"farmer"|"supplier"
        }[]=[
            {
                name:process.env.SEED_ADMIN_NAME,
                email:process.env.SEED_ADMIN_EMAIL,
                password:process.env.SEED_ADMIN_PASSWORD,
                role:"admin"
            },
            {
                name:process.env.SEED_FARMER_NAME,
                email:process.env.SEED_FARMER_EMAIL,
                password:process.env.SEED_FARMER_PASSWORD,
                role:"farmer"
            },
            {
                name:process.env.SEED_SUPPLIER_NAME,
                email:process.env.SEED_SUPPLIER_EMAIL,
                password:process.env.SEED_SUPPLIER_PASSWORD,
                role:"supplier"
            }
        ]

        for(const user of users){
            if(!user.name || !user.email || !user.password){
                throw new Error(`Missing environment variables for ${user.role}`);
            }

            const existingUser=await User.findOne({email:user.email});

            if(existingUser){
                console.log(`${user.role} already exists. Skipping`);
                continue;
            }

            const passwordHash=await bcrypt.hash(user.password,10);

            await User.create({
                name:user.name,
                email:user.email,
                passwordHash,
                role:user.role
            });

            console.log(`${user.role} account created successfully`);


        }
    }catch(error){
        console.error("Seeding failed:",error);
        process.exitCode=1;
    }finally{
        await User.db?.close();
    }
}

seedUsers();