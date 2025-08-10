const ProductOrder = require('../models/ProductOrder');
const mongoose = require('mongoose');

const findAllByProductId = async (productId) => {
  return await ProductOrder.find({ products: productId }).populate('products');
};

const findByProductName = async (productName) => {
  return await ProductOrder.findOne().populate({
    path: 'products',
    match: { productName: { $regex: new RegExp(`^${productName}$`, 'i') } }
  });
};

const findByUserId = async (userId) => {
  return await ProductOrder.find({ users: userId }).populate('users');
};

const findByUserIdAndProductName = async (userId , productname) => {
    return await ProductOrder.findOne({
        users : userId
    }).populate({
        path : 'products',
        match : {productName : {$regex : new RegExp(`^${productname}$` , 'i')}}
    });
};

const findTopOrderProducts = async  (limit) => {
    return await ProductOrder.aggregate([
        {
            $group : {
                _id: '$products',
                orderCount : {$sum : 1}
            }
        },
        {$sort: {orderCount : -1}},
        {$limit : limit},
        {
            $lookup : {
                from : 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        {
            $unwind : '$productDetails'
        },
        {
            $project : {
                _id : 0,
                product : '$productDetails',
                orderCount : 1
            }
        }
    ]);
};

module.exports = {
    findAllByProductId,
    findByProductName,
    findByUserId,
    findByUserIdAndProductName,
    findTopOrderProducts
}