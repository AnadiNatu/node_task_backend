const User = require('../models');

const findByEmail = async (email) => {
    return await User.findOne({email : {$regex : new RegExp(email , 'i')}});
};

const findUsersByNameContaining = async (name) => {
    return await User.findOne({
        $or : [
            {fname : {$regex : new RegExp(name , 'i')}},
            { lname : {$regex : new RegExp(name , 'i')}}  
        ]
    });
};

const findUserByRole = async (role) => {
    return await User.find({userRoles : role});
};

const findUserByNameAndRole = async(name , role) => {
    return await User.findOne({
        $and : [
            {
                $or : [
                    {fname : {$regex : new RegExp(name , 'i')}},
                    {lname : {$regex : new RegExp(name , 'i')}}
                ]
            },
            {userRoles : role}
        ]
    });
};

module.exports = {
    findByEmail,
    findUserByNameAndRole,
    findUserByRole,
    findUsersByNameContaining
}