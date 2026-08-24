import User from '../models/User.js'

const findUserByEmail=async(email:string)=>{
    return await User.findOne({email})
}

const createUser=async(userData:{
    name:string,
    email:string,
    passwordHash:string,
    role:"buyer"
})=>{
    return await User.create(userData);
}

export {findUserByEmail,createUser};