const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName : {type : String , required : true , trim : true},
    productDesc : {type : String , maxlength : 1000  , trim : true},
    productInventory : {type : Number , required : true , min : 0},
    imageUrl : {type : String , default : null},
    price : {type : Number , required : true , min : 0},
} , {
    timestamps : true,
});

productSchema.index({productName : 'text' , productDesc : 'text'});

module.exports = mongoose.model('Product' , productSchema);
