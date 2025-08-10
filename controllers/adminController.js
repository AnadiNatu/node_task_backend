const User = require('../models/User');
const Product = require('../models/Product');
const ProductOrder = require('../models/ProductOrder');
const OrderLog = require('../models/OrderLog');
const {getCurrentUser , getCurrentUsername} = require('../utils/authHelpers');
const storage = require('../middleware/upload');
const upload = require('../middleware/upload');


class AdminController {

    static async getProductById(req , res){
        try{
            const {id} = req.params;
            const product = await Product.findById(id);

            if(!product){
                return res.status(404).json({message : `Product with ID ${id} not found`});
            }

            const orders = await Product.findById(id);
            const orderIds = orders.modifiedPaths(order => order._id);

            const productDTO = {
                productId : product._id,
                productName : product.productName,
                productDesc : product.productDesc,
                productInventory : product.productInventory,
                price : product.price,
                imageUrl : product.imageUrl,
                productOrderIds : orderIds
            };

            return res.status(200).json(productDTO);
        }catch(error){
            console.error('Get product by ID error:' , error);
            return res.status(500).json({message : 'Failed to fetch product'});
        }
    }


    static async getProductByName(req, res) {
    try {
      const { name } = req.query;
      
      const product = await Product.findOne({ 
        productName: { $regex: new RegExp(name, 'i') } 
      });
      
      if (!product) {
        return res.status(404).json({ message: `Product with name ${name} not found` });
      }

      // Get associated order IDs
      const orders = await ProductOrder.find({ productId: product._id });
      const orderIds = orders.map(order => order._id);

      const productDTO = {
        productId: product._id,
        productName: product.productName,
        productDesc: product.productDesc,
        productInventory: product.productInventory,
        price: product.price,
        imageUrl: product.imageUrl,
        productOrderIds: orderIds
      };

      return res.status(200).json(productDTO);
    } catch (error) {
      console.error('Get product by name error:', error);
      return res.status(500).json({ message: 'Failed to fetch product' });
    }
  }


  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: `User with ID ${id} not found` });
      }

      // Get user's order IDs
      const orders = await ProductOrder.find({ userId: id });
      const orderIds = orders.map(order => order._id);

      const userDTO = {
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        orderIds: orderIds
      };

      return res.status(200).json(userDTO);
    } catch (error) {
      console.error('Get user by ID error:', error);
      return res.status(404).json({ message: 'User not found' });
    }
  }


  static async getUserByName(req, res) {
    try {
      const { name } = req.params;
      
      const user = await User.findOne({
        $or: [
          { fname: { $regex: new RegExp(name, 'i') } },
          { lname: { $regex: new RegExp(name, 'i') } }
        ]
      });

      if (!user) {
        return res.status(404).json({ message: `User with name ${name} not found` });
      }

      // Get user's order IDs
      const orders = await ProductOrder.find({ userId: user._id });
      const orderIds = orders.map(order => order._id);

      const userDTO = {
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        orderIds: orderIds
      };

      return res.status(200).json(userDTO);
    } catch (error) {
      console.error('Get user by name error:', error);
      return res.status(404).json({ message: 'User not found' });
    }
  }


  static async getOrderById(req,res){
    try{
        const {id} = req.params;

        const order = await ProductOrder.findById(id)
        .populate('userId' , 'fname lname').populate('productId' , 'productName');

        if(!order){
            return res.status(404).json({message : 'Order not found'});
        }

        const orderDTO = {
        orderId: order._id,
        orderDate: order.orderDate,
        estimateDeliveryDate: order.estimateDeliveryDate,
        deliveryDate: order.deliveryDate,
        orderQuantity: order.orderQuantity,
        orderStatus: order.orderStatus,
        lateDeliveryStatus: order.lateDeliveryStatus,
        orderPrice: order.orderPrice,
        productName: order.productId.productName,
        userName: `${order.userId.fname} ${order.userId.lname}`
      };

      return res.status(200).json(orderDTO);
    }catch(error){
        console.error('Get order by ID error:' , error);
        return res.status(404).json({message : 'Order not found'});
    }
  }


  static async getOrdersByUserId(req, res) {
    try {
      const { userId } = req.params;
      
      const orders = await ProductOrder.find({ userId })
        .populate('userId', 'fname lname')
        .populate('productId', 'productName');

      if (orders.length === 0) {
        return res.status(404).json({ message: `No orders found for user ID: ${userId}` });
      }

      const orderDTOs = orders.map(order => ({
        orderId: order._id,
        orderDate: order.orderDate,
        estimateDeliveryDate: order.estimateDeliveryDate,
        deliveryDate: order.deliveryDate,
        orderQuantity: order.orderQuantity,
        orderStatus: order.orderStatus,
        lateDeliveryStatus: order.lateDeliveryStatus,
        orderPrice: order.orderPrice,
        productName: order.productId.productName,
        userName: `${order.userId.fname} ${order.userId.lname}`
      }));

      return res.status(200).json(orderDTOs);
    } catch (error) {
      console.error('Get orders by user ID error:', error);
      return res.status(404).json({ message: 'Orders not found' });
    }
  }

   static async getOrdersByProductId(req, res) {
    try {
      const { productId } = req.params;
      
      const orders = await ProductOrder.find({ productId })
        .populate('userId', 'fname lname')
        .populate('productId', 'productName');

      if (orders.length === 0) {
        return res.status(404).json({ message: `No orders found for product ID: ${productId}` });
      }

      const orderDTOs = orders.map(order => ({
        orderId: order._id,
        orderDate: order.orderDate,
        estimateDeliveryDate: order.estimateDeliveryDate,
        deliveryDate: order.deliveryDate,
        orderQuantity: order.orderQuantity,
        orderStatus: order.orderStatus,
        lateDeliveryStatus: order.lateDeliveryStatus,
        orderPrice: order.orderPrice,
        productName: order.productId.productName,
        userName: `${order.userId.fname} ${order.userId.lname}`
      }));

      return res.status(200).json(orderDTOs);
    } catch (error) {
      console.error('Get orders by product ID error:', error);
      return res.status(404).json({ message: 'Orders not found' });
    }
  }


//   ========= CREATE OPERATIONS =========

static createProduct = [
    upload.single('imageFile'),
    async(req , res) => {
        try{
            const {productName , productDesc , productInventory , price} = req.body;

            const existingProduct = await Product.findOne({
                productName : {$regex : new RegExp(productName , 'i')}
            });

            if(existingProduct){
                return res.status(400).json({message: 'Product with this name already exists' }); 
            }

            const newProduct = new Product({
                productName,
                productDesc,
                productInventory : parseInt(productInventory),
                price : parseFloat(price),
                imageUrl : req.file ? req.file.fileName : null
            });

            const savedProduct = await newProduct.save();

            const productDTO = {
          productId: savedProduct._id,
          productName: savedProduct.productName,
          productDesc: savedProduct.productDesc,
          productInventory: savedProduct.productInventory,
          price: savedProduct.price,
          imageUrl: savedProduct.imageUrl,
          productOrderIds: []
        };  
        
        return res.status(201).json(productDTO);
    }catch(error){
        console.error('Create product error:' , error);
        return res.status(400).json({message : 'Failed to create product'});
    }
}
];

static async createOrder(req , res){
    try{
        const {productName, orderQuantity, estimateDeliveryDate, deliveryDate, orderStatus} = req.body;

        const currentUser = await getCurrentUser(req);
        if(!currentUser){
            return res.status(401).json({message : 'User not authenticated'});
        }

        const product = await Product.findOne({
            productName : {$regex : new RegExp(productName , 'i')}
        });

        if(product.productInventory < orderQuantity){
            return res.status(400).json({message : 'Insufficient inventory'});
        }

        const orderPrice = product.price * orderQuantity;
        
        const newOrder = new ProductOrder({
            userId : currentUser._id,
            productId : product._id,
            orderQuantity,
            orderPrice,
            orderStatus : orderStatus || 'PENDING',
            estimateDeliveryDate : estimateDeliveryDate ? new Date(estimateDeliveryDate) : null,
            deliveryDate : deliveryDate ? new Date(deliveryDate) : null
        });

        const savedOrder = await newOrder.save();

        await AdminController.createOrderLog(
            currentUser._id,
            product._id,
            savedOrder._id,
            deliveryDate ? new Date(deliveryDate) : null,
            product.productInventory,
            orderPrice
        );

        product.productInventory -= orderQuantity;
        await product.save();

        const populateOrder = await ProductOrder.findById(savedOrder._id)
        .populate('userId' , 'fname lname')
        .populate('productId' , 'productName');

        const orderDTO = {
        orderId: populatedOrder._id,
        orderDate: populatedOrder.orderDate,
        orderQuantity: populatedOrder.orderQuantity,
        estimateDeliveryDate: populatedOrder.estimateDeliveryDate,
        deliveryDate: populatedOrder.deliveryDate,
        userName: `${populatedOrder.userId.fname} ${populatedOrder.userId.lname}`,
        userId: populatedOrder.userId._id,
        productName: populatedOrder.productId.productName,
        productId: populatedOrder.productId._id
      };

      return res.status(202).json(orderDTO);
    }catch(error){
        console.error('Create order error : ' , error);
        return res.status(400).json({message : 'Failed to create order'});
    }
}

 static async createOrderLog(userId, productId, orderId, deliveredOn, productInventory, totalOrderPrice) {
    try {
      const orderLog = new OrderLog({
        userId,
        productId,
        productOrderId: orderId,
        deliveredOn,
        productInventory,
        totalOrderPrice
      });

      return await orderLog.save();
    } catch (error) {
      console.error('Create order log error:', error);
      throw error;
    }
  }

  // ================ GET ALL OPERATIONS ================

  static async getAllUsers(req , res) {
    try{
        const users = await User.find({});

        if(users.length === 0){
            return res.status(404).json({message : 'No users found'});
        }

        const userDTOs = await Promise.all(users.map(async(user) => {
            const orders = await ProductOrder.find({userId : user._id});
            const orderIds = orders.map(order => order._id);

            return{
                fname : user.fname,
                lname : user.lname,
                email  : user.email,
                phoneNumber : user.phoneNumber,
                orderIds : orderIds
            };
        }));

        return res.status(200).json(userDTOs);
    }catch(errors){
        console.error('Get all users erros:' , error);
        return res.status(500).json({message : 'Failed to fetch users'});
    }
  }

  // Get all products (replaces getAllProducts)
  static async getAllProducts(req, res) {
    try {
      const products = await Product.find({});
      
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found' });
      }

      const productDTOs = await Promise.all(products.map(async (product) => {
        const orders = await ProductOrder.find({ productId: product._id });
        const orderIds = orders.map(order => order._id);

        return {
          productId: product._id,
          productName: product.productName,
          productDesc: product.productDesc,
          productInventory: product.productInventory,
          price: product.price,
          imageUrl: product.imageUrl,
          productOrderIds: orderIds
        };
      }));

      return res.status(200).json(productDTOs);
    } catch (error) {
      console.error('Get all products error:', error);
      return res.status(500).json({ message: 'Failed to fetch products' });
    }
  }

  // Get all orders (replaces getAllOrders)
  static async getAllOrders(req, res) {
    try {
      const orders = await ProductOrder.find({})
        .populate('userId', 'fname lname')
        .populate('productId', 'productName');
      
      if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
      }

      const orderDTOs = orders.map(order => ({
        orderId: order._id,
        orderDate: order.orderDate,
        orderQuantity: order.orderQuantity,
        estimateDeliveryDate: order.estimateDeliveryDate,
        deliveryDate: order.deliveryDate,
        userName: `${order.userId.fname} ${order.userId.lname}`,
        userId: order.userId._id,
        productName: order.productId.productName,
        productId: order.productId._id
      }));

      return res.status(200).json(orderDTOs);
    } catch (error) {
      console.error('Get all orders error:', error);
      return res.status(500).json({ message: 'Failed to fetch orders' });
    }
  }

// ================ SPECIALIZED QUERIES ================

// Get orders by product name (replaces getOrdersByProductName)
  static async getOrdersByProductName(req, res) {
    try {
      const { name } = req.params;
      
      const product = await Product.findOne({ 
        productName: { $regex: new RegExp(name, 'i') } 
      });
      
      if (!product) {
        return res.status(404).json({ message: `Product with name ${name} doesn't exist` });
      }

      const orders = await ProductOrder.find({ productId: product._id })
        .populate('userId', 'fname lname')
        .populate('productId', 'productName');

      if (orders.length === 0) {
        return res.status(404).json({ message: 'No products with such name found' });
      }

      const orderDTOs = orders.map(order => ({
        orderId: order._id,
        orderDate: order.orderDate,
        orderQuantity: order.orderQuantity,
        estimateDeliveryDate: order.estimateDeliveryDate,
        deliveryDate: order.deliveryDate,
        userName: `${order.userId.fname} ${order.userId.lname}`,
        userId: order.userId._id,
        productName: order.productId.productName,
        productId: order.productId._id
      }));

      return res.status(200).json(orderDTOs);
    } catch (error) {
      console.error('Get orders by product name error:', error);
      return res.status(500).json({ message: 'Failed to fetch orders' });
    }
  }

  // Get order by product name and user ID (replaces getOrdersByProductNameAndUserId)
  static async getOrderByProductAndUserId(req, res) {
    try {
      const { productName, userId } = req.query;
      
      const product = await Product.findOne({ 
        productName: { $regex: new RegExp(productName, 'i') } 
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const order = await ProductOrder.findOne({ 
        userId, 
        productId: product._id 
      })
        .populate('userId', 'fname lname')
        .populate('productId', 'productName');

      if (!order) {
        return res.status(404).json({ 
          message: `Order for Product ${productName} made by user with ID ${userId} was not found` 
        });
      }

      const orderDTO = {
        orderId: order._id,
        orderDate: order.orderDate,
        orderQuantity: order.orderQuantity,
        estimateDeliveryDate: order.estimateDeliveryDate,
        deliveryDate: order.deliveryDate,
        userName: `${order.userId.fname} ${order.userId.lname}`,
        userId: order.userId._id,
        productName: order.productId.productName,
        productId: order.productId._id
      };

      return res.status(200).json(orderDTO);
    } catch (error) {
      console.error('Get order by product and user ID error:', error);
      return res.status(500).json({ message: 'Failed to fetch order' });
    }
  }

// ================ UPDATE OPERATIONS ================

static async updateProduct(req , res){

    try{
        const {productName , productDesc , productInventory , price} = req.body;
        const product = await Product.findOne({
            productName : {$regex : new ReqExp(productName,'i')}
        });

        if(!product){
            return res.status(404).json({message : `Product with name ${productName} doesn't exist`});
        }

        product.productDesc = productDesc || product.productDesc;
        product.productInventory = productInventory || product.productInventory;
        product.price = price || product.price;

        const updatedProduct = await product.save();

        const orders = await ProductOrder.find({productId : updatedProduct._id});
        const orderIds = orders.map(order => order._id);

        const productDTO = {
            productId : updatedProduct._id,
            productName : updatedProduct.productName,
            productDesc : updatedProduct.productDesc,
            productInventory : updatedProduct.productInventory,
            price : updatedProduct.price,
            image : updatedProduct.imageUrl,
            productOrderIds : orderIds
        }

        return res.status(200).json(productDTO);
    }catch(error){
        console.error('Update product error:' , error);
        return res.status(500).json({message : 'Failed to update product'});
    }
}

static async updateOrder(req , res){
    try{
        const {productName , orderDate , estimateDeliveryDate , deliveryDate , orderQuantity} = req.body;

        const currentUser = await getCurrentUser(req);
        if(!currentUser){
            return res.status(401).json({message : 'User not authenticated'});
        }

        const product = await Product.findOne({
            productName : {$regex : new RegExp(productNaem , 'i')}
        });

        if(!product){
            return res.status(404).json({message : 'Product not found'});
        }

        const order = await ProductOrder.findOne({
            userId : currentUser._id,
            productId : product._id
        });

        if(!order){
            return res.status(404).json({
                message : `Product Order for Product ${productName} made by User : ${currentUser.fname} ${currentUser.lname} was not found`
            });
        }

        order.orderDate = orderDate ? new Date(orderDate) : order.orderDate;
        order.estimateDeliveryDate = estimateDeliveryDate ? new Date(estimateDeliveryDate) : order.estimateDeliveryDate;
        order.deliveryDate = deliveryDate ? new Date(deliveryDate) : order.deliveryDate;
        order.orderQuantity = orderQuantity || order.orderQuantity;

        const updateOrder = await order.save();

        const populateOrder = await ProductOrder.findById(updateOrder._id)
        .populate('userId' , 'fname lname')
        .populate('productId' , 'productName');

        const orderDTO = {
        orderId: populatedOrder._id,
        orderDate: populatedOrder.orderDate,
        orderQuantity: populatedOrder.orderQuantity,
        estimateDeliveryDate: populatedOrder.estimateDeliveryDate,
        deliveryDate: populatedOrder.deliveryDate,
        userName: `${populatedOrder.userId.fname} ${populatedOrder.userId.lname}`,
        userId: populatedOrder.userId._id,
        productName: populatedOrder.productId.productName,
        productId: populatedOrder.productId._id
      };

      return res.status(200).json(orderDTO);
    }catch(error){
        console.error('Update order error:' , error);
        return res.status(500).json({message : 'Failed to update order'});
    }
}

// ================ DELETE OPERATIONS ================

static async deleteProduct(req , res){
    try{
        const {productName} = req.params;
        const product = await Product.findOne({
            productName : {$regex : new RegExp(productName , 'i')}
        });

        if(!product){
            return res.status(404).json({message : 'Product not found'});
        }

        await ProductOrder.deleteMany({productId : product._id});
        await OrderLog.deleteMany({productId : product._id});

        await Product.findByIdAndDelete(product._id);

        return res.status(200).json({message : 'Product deleted successfully'});
    }catch(error){
        console.error('Delete product error:' , error);
        return res.status(500).json({message : 'Failed to delete product'});
    }
}

static async deleteOrder(req , res){
    try{
        const {userId , productName} = req.query;

        const product = await Product.findOne({
            productName : {$regex : new RegExp(productName , 'i')}
        });

        if(!product){
            return res.status(404).json({message : 'Product not found'});
        }

        const order = await ProductOrder.findOne({
            userId,
            productId : product._id
        });

        if(!order){
            return res.status(404).json({message : 'Order not found for deletion'});
        }

        await OrderLog.deleteMany({productOrderId : order._id});

        await ProductOrder.findByIdAndDelete({productOrderId : order._id});
        return res.status(200).json({message : 'Order deleted successfully'});

    }catch(error){
        console.error('Delete order error: ' , error);
        return res.status(500).json({message : 'Failed to delete order'});
    }
}

// ================ ANALYTICS & SORTING ================

static async getProductByPriceAsc(req , res){
    try{
        const products = await Product.find({}).sort({price : 1});

        const productDTOs = await Promise.all(products.map(async (product) => {
            const orders = await ProductOrder.find({productId : product._id});
            const orderIds = orders.map(order => order._id);

            return {
               productId: product._id,
               productName: product.productName,
               productDesc: product.productDesc,
               productInventory: product.productInventory,
               price: product.price,
               imageUrl: product.imageUrl,
               productOrderIds: orderIds 
            };
        }));
        return res.status(200).json(productDTOs);
    }catch(error){
        console.error('Get products by price ASC error:', error);
        return res.status(500).json({message : 'Product list not found'});
    }
}

static async getProductByPriceDesc(req , res){
    try{
        const products = await Product.find({}).sort({price : -1});

        const productDTOs = await Promise.all(products.map(async (product) => {
            const orders = await ProductOrder.find({productId : product._id});
            const orderIds = orders.map(order => order._id);

            return {
               productId: product._id,
               productName: product.productName,
               productDesc: product.productDesc,
               productInventory: product.productInventory,
               price: product.price,
               imageUrl: product.imageUrl,
               productOrderIds: orderIds 
            };
        }));
        return res.status(200).json(productDTOs);
    }catch(error){
        console.error('Get products by price ASC error:', error);
        return res.status(500).json({message : 'Product list not found'});
    }
}

static async getTopOrderedProduct(req ,res){
    try{
        const {topN} = req.query;
        const limit = parseInt(topN) || 10;

        const results = await ProductOrder.aggregate([
            {
                $group : {
                    _id : '$productId',
                    orderCount : {$sum : 1}
                }
            },
            {
                $lookup : {
                    from : 'producta',
                    localField : '_id',
                    foreignField : '_id',
                    as : 'product'
                }
            },
            {
                $unwind : '$product'
            },
            {
                $sort:{orderCount : -1}
            },
            {
                $limit:limit
            }
        ]);

        const productDTOs = await Promise.all(results.map(async(result) => {
            const product = result.product;
            const orders = await ProductOrder.find({productId : product._id});
            const orderId = orders.map(order => order._id);

             return {
          productId: product._id,
          productName: product.productName,
          productDesc: product.productDesc,
          productInventory: product.productInventory,
          price: product.price,
          imageUrl: product.imageUrl,
          productOrderIds: orderIds
             };
        }));

        return res.status(200).json(productDTOs);
    }catch(error){
        console.error('Get top ordered products errors:' , error);
        return res.status(500).json({message : 'Failed to fetch top ordered products'});
    }
}

static async getTotalRevenueForProduct(req, res) {
    try {
      const { productName } = req.query;
      
      const product = await Product.findOne({ 
        productName: { $regex: new RegExp(productName, 'i') } 
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Calculate total revenue using aggregation
      const revenueResult = await ProductOrder.aggregate([
        {
          $match: { productId: product._id }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$orderPrice' }
          }
        }
      ]);

      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

      return res.status(200).json(totalRevenue);
    } catch (error) {
      console.error('Get total revenue error:', error);
      return res.status(500).json({ message: 'Failed to calculate revenue' });
    }
  }

  // Get inventory status (replaces getInventoryStatus)
  static async getInventoryStatus(req, res) {
    try {
      const products = await Product.find({}, 'productName productInventory');

      const inventoryDTO = products.map(product => ({
        productName: product.productName,
        inventory: product.productInventory
      }));

      return res.status(200).json(inventoryDTO);
    } catch (error) {
      console.error('Get inventory status error:', error);
      return res.status(500).json({ message: 'Failed to fetch inventory status' });
    }
  }

// ================ ORDER LOGS ================

  // Get order logs by current user (replaces getOrderLogsByUser)
  static async getOrderLogsByUser(req, res) {
    try {
      const currentUser = await getCurrentUser(req);
      if (!currentUser) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const logs = await OrderLog.find({ userId: currentUser._id })
        .populate('userId', 'fname lname')
        .populate('productId', 'productName')
        .populate('productOrderId');

      if (logs.length === 0) {
        return res.status(404).json({ message: `No order logs found for user ID: ${currentUser._id}` });
      }

      const logDTOs = logs.map(log => ({
        orderId: log.productOrderId ? log.productOrderId._id : null,
        productName: log.productId ? log.productId.productName : null,
        userName: log.userId ? `${log.userId.fname} ${log.userId.lname}` : null,
        orderQuantity: log.productOrderId ? log.productOrderId.orderQuantity : 0,
        orderPrice: log.productOrderId ? log.productOrderId.orderPrice : 0.0,
        orderStatus: log.productOrderId ? log.productOrderId.orderStatus : null,
        productInventory: log.productInventory
      }));

      return res.status(200).json(logDTOs);
    } catch (error) {
      console.error('Get order logs by user error:', error);
      return res.status(500).json({ message: 'Failed to fetch order logs' });
    }
  }

  // Get order logs by product (replaces getOrderLogByProductId)
  static async getOrderLogsByProduct(req, res) {
    try {
      const { productName } = req.query;
      
      const product = await Product.findOne({ 
        productName: { $regex: new RegExp(productName, 'i') } 
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Product entity not found' });
      }

      const logs = await OrderLog.find({ productId: product._id })
        .populate('userId', 'fname lname')
        .populate('productId', 'productName')
        .populate('productOrderId');

      if (logs.length === 0) {
        return res.status(404).json({ message: `No order logs found for Product ID: ${product._id}` });
      }

      const logDTOs = logs.map(log => ({
        orderId: log.productOrderId ? log.productOrderId._id : null,
        productName: log.productId ? log.productId.productName : null,
        userName: log.userId ? `${log.userId.fname} ${log.userId.lname}` : null,
        orderQuantity: log.productOrderId ? log.productOrderId.orderQuantity : 0,
        orderPrice: log.productOrderId ? log.productOrderId.orderPrice : 0.0,
        orderStatus: log.productOrderId ? log.productOrderId.orderStatus : null,
        productInventory: log.productInventory
      }));

      return res.status(200).json(logDTOs);
    } catch (error) {
      console.error('Get order logs by product error:', error);
      return res.status(500).json({ message: 'Failed to fetch order logs' });
    }
  }

  // Get order log by order ID (replaces getOrderLogByOrderId)
  static async getOrderLogByOrderId(req, res) {
    try {
      const { orderId } = req.params;
      
      const log = await OrderLog.findOne({ productOrderId: orderId })
        .populate('userId', 'fname lname')
        .populate('productId', 'productName')
        .populate('productOrderId');

      if (!log) {
        return res.status(404).json({ message: 'Order log not found' });
      }

      const logDTO = {
        orderId: log.productOrderId ? log.productOrderId._id : null,
        productName: log.productId ? log.productId.productName : null,
        userName: log.userId ? `${log.userId.fname} ${log.userId.lname}` : null,
        orderQuantity: log.productOrderId ? log.productOrderId.orderQuantity : 0,
        orderPrice: log.productOrderId ? log.productOrderId.orderPrice : 0.0,
        orderStatus: log.productOrderId ? log.productOrderId.orderStatus : null,
        productInventory: log.productInventory
      };

      return res.status(200).json(logDTO);
    } catch (error) {
      console.error('Get order log by order ID error:', error);
      return res.status(500).json({ message: 'Failed to fetch order log' });
    }
  }

  // Get order log by user and product (replaces getOrderLogUserAndProduct)
  static async getOrderLogByUserAndProduct(req, res) {
    try {
      const { productName } = req.query;
      
      const currentUser = await getCurrentUser(req);
      if (!currentUser) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const product = await Product.findOne({ 
        productName: { $regex: new RegExp(productName, 'i') } 
      });
      
      if (!product) {
        return res.status(404).json({ message: 'No product found' });
      }

      const log = await OrderLog.findOne({ 
        userId: currentUser._id, 
        productId: product._id 
      })
        .populate('userId', 'fname lname')
        .populate('productId', 'productName')
        .populate('productOrderId');

      if (!log) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const logDTO = {
        orderId: log.productOrderId ? log.productOrderId._id : null,
        productName: log.productId ? log.productId.productName : null,
        userName: log.userId ? `${log.userId.fname} ${log.userId.lname}` : null,
        orderQuantity: log.productOrderId ? log.productOrderId.orderQuantity : 0,
        orderPrice: log.productOrderId ? log.productOrderId.orderPrice : 0.0,
        orderStatus: log.productOrderId ? log.productOrderId.orderStatus : null,
        productInventory: log.productInventory
      };

      return res.status(200).json(logDTO);
    } catch (error) {
      console.error('Get order log by user and product error:', error);
      return res.status(500).json({ message: 'Failed to fetch order log' });
    }
  }

  // Get all logs sorted by delivery date DESC (replaces getAllLogsSortedByDeliveryDateDesc)
  static async getAllLogsSortedByDeliveryDateDesc(req, res) {
    try {
      const logs = await OrderLog.find({})
        .populate('userId', 'fname lname')
        .populate('productId', 'productName')
        .populate('productOrderId')
        .sort({ deliveredOn: -1 });

      const logDTOs = logs.map(log => ({
        orderId: log.productOrderId ? log.productOrderId._id : null,
        productName: log.productId ? log.productId.productName : null,
        userName: log.userId ? `${log.userId.fname} ${log.userId.lname}` : null,
        orderQuantity: log.productOrderId ? log.productOrderId.orderQuantity : 0,
        orderPrice: log.productOrderId ? log.productOrderId.orderPrice : 0.0,
        orderStatus: log.productOrderId ? log.productOrderId.orderStatus : null,
        productInventory: log.productInventory,
        deliveredOn: log.deliveredOn
      }));

      return res.status(200).json(logDTOs);
    } catch (error) {
      console.error('Get all logs sorted by delivery date error:', error);
      return res.status(500).json({ message: 'Failed to fetch order logs' });
    }
  }

  // Get order logs between dates (replaces getOrderLogsBetweenDates)
  static async getOrderLogsBetweenDates(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }

      const logs = await OrderLog.find({
        deliveredOn: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      })
        .populate('userId', 'fname lname')
        .populate('productId', 'productName')
        .populate('productOrderId');

      const logDTOs = logs.map(log => ({
        orderId: log.productOrderId ? log.productOrderId._id : null,
        productName: log.productId ? log.productId.productName : null,
        userName: log.userId ? `${log.userId.fname} ${log.userId.lname}` : null,
        orderQuantity: log.productOrderId ? log.productOrderId.orderQuantity : 0,
        orderPrice: log.productOrderId ? log.productOrderId.orderPrice : 0.0,
        orderStatus: log.productOrderId ? log.productOrderId.orderStatus : null,
        productInventory: log.productInventory,
        deliveredOn: log.deliveredOn
      }));

      return res.status(200).json(logDTOs);
    } catch (error) {
      console.error('Get order logs between dates error:', error);
      return res.status(500).json({ message: 'Failed to fetch order logs' });
    }
  }
}

module.exports = AdminController;