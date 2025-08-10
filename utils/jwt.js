// const jwt = require('jsonwebtoken');
// const SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

// const generateToken = (user) => {
//     return jwt.sign(
//         {
//             id : user._id,
//             email : user.email,
//             roles : [user.userRoles],
//         },
//         SECRET,
//         {expiresIn : '30m'}
//     );
// };

// const verifyToken = (token) => {
//     return jwt.verify(token , SECRET);
// };

// module.exports = {
//     generateToken,
//     verifyToken,
// };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

class JwtUtils{

    static generateToken(userId , email , roles){
        const payload = {
            userId,
            email,
            roles : [roles]
        };

        return jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn : process.env.JWT_EXPIRE || '30m',
                subject : email
            }
        );
    }

    static extractUsername(token){
        try{
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            return decoded.email;
        }catch(error){
            throw new Error('Invalid token');
        }
    }

    static extractUserId(token){
        try{
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            return decoded.userId;
        }catch(error){
            throw new Error('Invalid token');
        }
    }

    static extractAllClaims(token){
        try{
            return jwt.verify(token , process.env.JWT_TOKEN);
        }catch(error){
            throw new Error('Invalid token');
        }
    }

    static async isTokenValid(token , user){
        try{
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            return decoded.email === user.email && !this.isTokenExpired(token);
        }catch(error){
            return true;
        }
    }

    static isTokenExpired(token){
        try{
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            return Date.now() >= decoded.exp * 1000;
        }catch(error){
            return true;
        }
    }
}

module.exports = JwtUtils;