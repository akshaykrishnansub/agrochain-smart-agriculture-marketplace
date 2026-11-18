import { Server } from "socket.io";

let io:Server;

//store existing socket.io server instance
const setIO=(socketServer:Server)=>{
    io=socketServer;
}

//let other backend files access that same instance
const getIO=()=>{
    return io;
}

export {setIO,getIO};