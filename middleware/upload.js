const multer = require('multer');
const path = require('path');
const {v4 : uuidv4} = require('uuid');

const storage = multer.diskStorage({
    destination : function(req , file , cb) {
        cb(null , process.env.UPLOAD_DIR || './uploads');
    },
    filename : function(req , file , cb){
        const uniqueName = uuidv4() + '_' + file.originalname;
        cb(null , uniqueName);
    },
});

const upload = multer({
    storage : storage,
    fileFilter : (req , file , cb) => {
        if(file.mimetype.startsWith('image/')){
            cb(null , true);
        }else{
            cb(new Error('Only image files are allowed!') , false);
        }
    },
    limits : {
        fileSize : 5 * 1024 * 1024
    }
});

module.exports = upload;