const mongoose = require('mongoose');

const orderLogSchema = new mongoose.Schema({
    product : {type : mongoose.Schema.Types.ObjectId , ref : 'Product' , required : true},
    user : {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true},
    productOrder : {type : mongoose.Schema.Types.ObjectId , ref : 'ProductOrder' , required : true},
    deliveredOn : {type : Date},
    productInventory : {type : Number},
    totalOrderPrice : {type : Number},
},{
    timestamps : true,
});

orderLogSchema.pre(/^find/ , function(next) {
    this.populate('userId' , 'fname lname')
    .populate('productId' , 'productName')
    .populate('productOrderId');
    next();
})

module.exports = mongoose.model('OrderLog' , orderLogSchema);