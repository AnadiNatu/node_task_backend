const requireRole = (roles) => {
    return (req , res , next) => {
        try{
            if(!req.user){
                return res.status(401).json({message : 'Authentication required. '});
            }

            const allowedRoles = Array.isArray(roles) ? roles : [roles];

            if(!allowedRoles.includes(req.user.userRoles)){
                return res.status(403).json({
                    message : `Access denied . Required role : ${allowedRoles.join(' or ')}`
                });
            }
            next();
        }catch(error){
            console.error('Role middleware error:' , error);
            return res.status(500).json({message : 'Authorization check failed'});
        }
    };
};

const requireAdmin = requireRole('ADMIN');
const requiredUser = requireRole(['USER' , 'ADMIN']);

module.exports = {
    requireRole,
    requireAdmin,
    requiredUser
};