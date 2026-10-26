import User from '../models/User.js';
const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};
const createUser = async (userData) => {
    return await User.create(userData);
};
const getUserById = async (userId) => {
    return await User.findById(userId).select("-passwordHash");
};
const updateUser = async (userId, userData) => {
    return await User.findByIdAndUpdate(userId, userData, {
        new: true,
        runValidators: true
    }).select("-passwordHash");
};
const addCertification = async (userId, certificationUrl) => {
    return await User.findByIdAndUpdate(userId, {
        $push: {
            certifications: certificationUrl
        }
    }, {
        new: true
    }).select("-passwordHash");
};
export { findUserByEmail, createUser, getUserById, updateUser, addCertification };
//# sourceMappingURL=userService.js.map