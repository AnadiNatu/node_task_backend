// const bcrypt = require('bcrypt');
// const jwt = require('../utils/jwt');
// const User = require('../models/User');
// const {sendResetEmail} = require('../utils/email');
// const path =  require('path');
// const fs = require('fs');
// const crypto = require('crypto');

// const register = async (req , res) => {
//     const {fname , lname , email , password , userRoles} = req.body;

//     const existingUser = await User.findOne({email});
//     if(existingUser) return res.status(406).json({message : 'User already exists'});

//     const hashedPassword = await bcrypt.hash(password , 10);
//     const user = new User({
//         fname,
//         lname,
//         email,
//         password : hashedPassword,
//         userRoles,
//     });

//     await user.save();

//     res.status(201).json(user);
// };

// const login = async (req , res) => {
//     const {email , password} = req.body;

//     const user = await User.findOne({email});
//     if(!user) return res.status(401).json({message : 'Incorrect email or passsword'});

//     const isMatch = await bcrypt.compare(password , user.password);
//     if(!isMatch) return res.status(401).json({message : 'Incorrect email or password'});

//     const token = jwt.generateToken(user);

//     res.status(202).json({
//         jwt : token,
//         userId : user._id,
//         fullName : user.fname + ' ' + user.lname,
//         userRoles : user.userRoles,
//     });
// };

// const uploadProfilePicture = async (req , res) => {
//     const userId = req.params.userId;
//     const file = req.file;

//     if(!file) return res.status(400).json({message : 'No file uploaded'});

//     const filePath = path.join('uploads' , 'profile-pics' , file.filename);

//     const user = await User.findByIdAndUpdate(userId , {profilePicture : filePath} , {new : true});
//     if(!user) return res.status(404).json({message : 'User not found'});

//     res.status(200).json({message : 'Profile picture uploaded' , filename : file.filename});
// }

// const forgotPassword = async (req,res) => {
//     const {email} = req.body;
//     const user = await User.findOne({email});

//     if(!user) return res.status(404).json({message : 'User not found'});

//     const token = crypto.randomBytes(20).toString('hex');
//     user.resetToken = token;
//     user.resetTokenExpiry = Date.now() + 1000*60*30;

//     await user.save();
//     await sendResetEmail(email , token);

//     res.status(200).json({message : 'Reset token sent to email'});
// };

// const resetPassword = async (req , res) => {
//     const user = await User.findOne({
//         email,
//         resetToken:token,
//         resetTokenExpiry: {$gt : Date.now()}, 
//     });

//     if(!user) return res.status(400).json({message : 'Invalid or expired token'});

//     const hashedPassword = await bcrypt.hash(newPassword , 10);
//     user.password = hashedPassword;
//     user.resetToken = null;
//     user.resetTokenExpiry = null;

//     await user.save();

//     res.status(200).json({message : 'Password reset successful'});
// };

// module.exports = {
//     register,
//     login,
//     uploadProfilePicture,
//     forgotPassword,
//     resetPassword,
// }

const User = require('../models/User');
const JwtUtils = require('../utils/jwt');
const {getCurrentUser} = require('../utils/authHelpers');
const emailService = require('../utils/email');
const storage = require('../middleware/upload');
const fs = require('fs').promises;


class AuthController {
    static async signup(req , res){
        try{
            const {fname , lname , email , password , phoneNumber} = req.body;

            const existingUser = await User.findOne({email : email.toLowerCase()});
            if(existingUser){
                return res.status(406).json({
                    message : 'User with this email already exists'
                });
            }

            const newUser = new User({
                fname,
                lname,
                email : email.toLowerCase(),
                phoneNumber,
                userRoles : 'USER'
            });

            const savedUser = await newUser.save();

            const userDTO = {
                id : savedUser._id,
                fname : savedUser.fname,
                lname : savedUser.lname,
                email : savedUser.email,
                phoneNumber : savedUser.phoneNumber,
                userRoles : savedUser.userRoles 
            };

            return res.status(201).json(userDTO);

        }catch(error){
            console.error('Signup error:' , error);
            return res.status(400).json({
                message : 'User registration failed',
                error : error.message
            });
        }
    }

    static async login(req , res){
        try{
            const {email , password} = req.body;

            const user =  await User.findOne({email : email.toLowerCase()});
            if(!user){
                return res.status(401).json({
                    message : 'Invalid email or password'
                });
            }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(401).json({
                message : 'Invalid email or password'
            });
        }

        const token = JwtUtils.generateToken(user._id , user.email , user.userRoles);

        const authResponse = {
            userId : user._id,
            jwt : token,
            fullName : user.fullName,
            userRoles : user.userRoles
        };

        return res.status(202).json(authResponse);
        }catch(error){
            console.error('Login error' , error);
            return res.status(500).json({
                message : 'Login failed',
                error : error.message
            });
        }
    }

    static uploadProfilePicture = [
    upload.single('file'),
    async (req, res) => {
      try {
        const { userId } = req.params;

        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Update user's profile picture
        user.profilePicture = req.file.filename;
        await user.save();

        return res.status(200).json({ 
          message: `Profile picture uploaded: ${req.file.filename}`,
          filename: req.file.filename
        });

      } catch (error) {
        console.error('Profile picture upload error:', error);
        return res.status(500).json({ 
          message: 'Failed to upload profile picture',
          error: error.message 
        });
      }
    }
  ];

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ 
          message: `User with email ${email} not found` 
        });
      }

      // Generate reset token
      const resetToken = JwtUtils.generateToken(user._id, user.email, user.userRoles);
      
      // Save reset token to user
      user.resetToken = resetToken;
      await user.save();

      // Create reset link
      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
      
      // Send email
      await emailService.sendEmail(
        email, 
        'Password Reset', 
        `Click the link to reset your password: ${resetLink}`
      );

      return res.status(200).json({ 
        message: 'Reset token sent to email' 
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({ 
        message: 'Failed to send reset token',
        error: error.message 
      });
    }
  }

  static async resetPassword(req , res){
    try{
        const {email , token , newPassword} = req.body;

        const isValidToken = await AuthController.validateResetToken(token , email);
        if(!isValidToken){
            return res.status(400).json({
                message : 'Invalid or expired token'
            });
        }

        const user = await User.findOne({email : email.toLowerCase()});
        if(!user){
            return res.status(404).json({message : 'User not found'});
        }
        
        user.password = newPassword;
        user.resetToken = null;
        await user.save();
        
        return res.status(200).json({
            message : 'Password reset successful'
        });
    }catch(error){
        console.error('Reset password error:' , error);
        return res.status(500).json({

            message : 'Failed to reset password',
            error : error.message
        });
    }
  }


  static async validateResetToken(token , email){
    try{
        const extractedEmail = JwtUtils.extractUsername(token);

        if(extractedEmail !== email.toLowerCase()){
            return false;
        }

        const user = await User.findOne({email : email.toLowerCase()});
        if(!user){
            return false;
        }

        return await JwtUtils.isTokenValid(token , user);
    }catch(error){
        console.error('Token validation error: ' , error);
        return false;
    }
  }

  static async initializeAdmin(){
    try{
        const existingAdmin = await User.findOne({userRoles : 'ADMIN'});
        if(!existingAdmin){
            const adminUser = new User({
                fname : 'Admin F',
                lname : 'Admin L',
                email : 'admin@test.com',
                password : 'admin',
                phoneNumber : '0000000000',
                userRoles : 'ADMIN'
            });

            await adminUser.save();
            console.log('Admin created successfully');
        }else{
            console.log('Admin already exists');
        }
    }catch(error){
        console.error('Failed to initialize admin:' , error.message);
    }
  }
}

module.exports = AuthController;