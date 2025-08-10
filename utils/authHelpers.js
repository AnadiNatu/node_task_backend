const User = require('../models/User');

const getCurrentUser = async (req) => {
    try{
        if(!req.user || !req.user.id){
            return null;
        }

        const user = await User.findById(req.user.id);
        return user;
    }catch(error){
        console.error('Error getting current user:' , error);
        return null;
    }
};

const getCurrentUsername = (req) => {
    return req.user ? req.user.email : null;
};

const hasRole = (req, role) => {
    return req.user && req.user.userRoles === role;
};

const isAdmin = (req) => {
    return hasRole(req ,'ADMIN');
};

const isUser = (req) => {
    return hasRole(req , 'USER');
};

module.exports = {
    getCurrentUser,
    getCurrentUsername,
    hasRole,
    isAdmin,
    isUser
};