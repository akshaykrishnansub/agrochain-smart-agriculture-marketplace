import {Redis} from 'ioredis';

const redis=process.env.REDIS_URL?new Redis(process.env.REDIS_URL):new Redis({
    host: process.env.REDIS_HOST||"127.0.0.1",
    port:6379
})

redis.on("connect",()=>{
    console.log("Redis connected successfully");
})

redis.on("error",(err)=>{
    console.error("Redis connection error",err);
})

export default redis;