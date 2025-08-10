const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname : {type : String , required : true , trim : true},
    lname : {type : String , required : true , trim : true},
    email : {type : String , required : true , unique : true , trim : true , lowercase : true},
    password : {type : String , require : true , minlength : 6},
    phoneNumber : {type : String , trim : true},
    userRoles : {
        type : String,
        enum : ['ADMIN' , 'USER'],
        default : 'USER',
        require : true,
    },
    resetToken : {type : String , default : null},
    profilePicture : {type : String , default : null},
} , {
    timestamps : true,
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password , salt);
        next();
    }catch(error){
        next(error);
    }
});

userSchema.virtual('fullname').get(function() {
    return `${this.fname} ${this.lname}`;
});

userSchema.set('toJSAON' , {virtuals : true});

module.exports = mongoose.model('User' , userSchema);