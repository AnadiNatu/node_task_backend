const mongoose = require('mongoose');

const productOrderSchema = new mongoose.Schema({
    orderDate : {type : Date ,default : Date.now , required : true},
    estimateDeliveryDate : {type : Date},
    deliveryDate : {type : Date},
    orderQuantity : {type : Number , required : true , min : 1},
    orderStatus : {
        type : String,
        enum : ['ORDER' , 'DISPATCH' , 'DELIVERED'],
        default : 'PENDING'
    },
    lateDeliveryStatus : {type : Boolean , default : false},
    orderPrice : {type : Number , required : true , min : 0},
    users : {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true},
    products : {type : mongoose.Schema.Types.ObjectId , ref : 'Product' , required : true},

}, {
    timestamps : true,
});

productOrderSchema.pre(/^find/ , function(next) {
    this.populate('userId' , 'fname lname email')
    .populate('productId' , 'productName price');
    next();
});

module.exports = mongoose.model('ProductOrder' , productOrderSchema);
