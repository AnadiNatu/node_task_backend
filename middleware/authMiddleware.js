// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const authenticateToken = async (req , res , next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if(!token) return res.sendStatus(401);

//     try{
//         const decoded = jwt.verify(token , process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);
//         next();
//     }catch(err){
//         res.status(403).json({message : 'Invalid token'});
//     }
// };


// // Role Based Auth (optional)
// const authorizeRole = (...roles) => {
//     return (req,res,next) => {
//         if(!roles.includes(req.user.userRoles)){
//             return res.status(403).json({message : 'Access denied'});
//         }
//         next();
//     };
// };

// module.exports = {authenticateToken , 
//     authorizeRole,
// };


// example usage:
// router.get('/admin/data', authenticateToken, authorizeRoles('ADMIN'), (req, res) => {
//   res.send('Only for ADMIN');
// });

const JwtUtils = require('../utils/jwt');
const User = require('../models/User');

const authenticateToken = async(req , res , next) => {
    try{
        const authHeader = req.header('Authorization');

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message : 'Access denied . No token provided.'});
        }

        const token = authHeader.substring(7);

        const email = JwtUtils.extractUsername(token);

        if(!email){
            return res.status(401).json({message : 'Invalid token. '});
        }

        const isValid = await JwtUtils.isTokenValid(token , user);
        if(!isValid){
            return res.status(401).json({message : 'Token is not valid.' });
        }

        req.user = {
            id : user._id,
            email : user.email,
            fname : user.fname,
            lname : user.lname,
            userRoles : user.userRoles,
            fullName : user.fullName
        };

        next();
    }catch(error){
        console.error('Auth middleware error:' , error);
        return res.status(401).json({message : 'Token verification failed'});
    };
};
    const optionalAuth = async (req , res , next) => {
        try{
            const authHeader = req.hheader('Authorization');

            if(authHeader && authHeader.startsWith('Bearer ')){
                const token = authHeader.substring(7);
                const email = JwtUtils.extractUsername(token);

                if(email){
                    const user = await User.findOne({email});
                    if(user && await JwtUtils.isTokenValid(token , user)){
                        req.user = {
                            id : user._id,
                            email : user.email,
                            fname : user.fname,
                            lname : user.lname,
                            userRoles : user.userRoles,
                            fullName : user.fullName
                        };
                    }
                }
            }
            next();
        }catch(error){
            next();
        }
    };


module.exports = {
    authenticateToken,
    optionalAuth
};
