const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const {authenticateToken} = require('../middleware/authMiddleware');
const {requireAdmin} = require('../middleware/roleMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/userBy/:id' , AdminController.getUserById);

router.get('/searchUser/:name', AdminController.getUserByName);

// Get order by ID (replaces @GetMapping("orderBy/{id}"))
router.get('/orderBy/:id', AdminController.getOrderById);

// Get orders by user ID (replaces @GetMapping("orderBy/user/{userId}"))
router.get('/orderBy/user/:userId', AdminController.getOrdersByUserId);

// Get orders by product ID (replaces @GetMapping("orderBy/product/{productId}"))
router.get('/orderBy/product/:productId', AdminController.getOrdersByProductId);

// Get product by ID (replaces @GetMapping("products/{id}"))
router.get('/products/:id', AdminController.getProductById);

// Search product by name (replaces @GetMapping("searchProduct"))
router.get('/searchProduct', AdminController.getProductByName);

// Create product (replaces @PostMapping(value = "product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE))
router.post('/product', AdminController.createProduct);

// Create order (replaces @PostMapping("order"))
router.post('/order', AdminController.createOrder);

// Get all users (replaces @GetMapping("users"))
router.get('/users', AdminController.getAllUsers);

// Get all products (replaces @GetMapping("product/all"))
router.get('/product/all', AdminController.getAllProducts);

// Get all orders (replaces @GetMapping("order/all"))
router.get('/order/all', AdminController.getAllOrders);

// Get orders by product name (replaces @GetMapping("product/all/{name}"))
router.get('/product/all/:name', AdminController.getOrdersByProductName);

// Get orders by user ID (replaces @GetMapping("product/user/all/{Id}"))
router.get('/product/user/all/:userId', AdminController.getOrdersByUserId);

// Get order by product name and user ID (replaces @GetMapping("product/order/all"))
router.get('/product/order/all', AdminController.getOrderByProductAndUserId);

// Update product (replaces @PutMapping("updateProduct"))
router.put('/updateProduct', AdminController.updateProduct);

// Update order (replaces @PutMapping("updateOrder"))
router.put('/updateOrder', AdminController.updateOrder);

// Delete product (replaces @DeleteMapping("delete/product/{productName}"))
router.delete('/delete/product/:productName', AdminController.deleteProduct);

// Delete order (replaces @DeleteMapping("delete/order"))
router.delete('/delete/order', AdminController.deleteOrder);

// Get products sorted by price ASC (replaces @GetMapping("/price/asc"))
router.get('/price/asc', AdminController.getProductsByPriceAsc);

// Get products sorted by price DESC (replaces @GetMapping("/price/desc"))
router.get('/price/desc', AdminController.getProductsByPriceDesc);

// Get top ordered products (replaces @GetMapping("/top-ordered"))
router.get('/top-ordered', AdminController.getTopOrderedProducts);

// Get total revenue for product (replaces @GetMapping("/revenue"))
router.get('/revenue', AdminController.getTotalRevenueForProduct);

// Get inventory status (replaces @GetMapping("/inventory"))
router.get('/inventory', AdminController.getInventoryStatus);

// Get order logs by current user (replaces @GetMapping("/logs/user"))
router.get('/logs/user', AdminController.getOrderLogsByUser);

// Get order logs by product (replaces @GetMapping("/logs/product"))
router.get('/logs/product', AdminController.getOrderLogsByProduct);

// Get order log by order ID (replaces @GetMapping("/logs/{orderId}"))
router.get('/logs/:orderId', AdminController.getOrderLogByOrderId);

// Get order log by user and product (replaces @GetMapping("/logs/user-product"))
router.get('/logs/user-product', AdminController.getOrderLogByUserAndProduct);

// Get all logs sorted by delivery date DESC (replaces @GetMapping("/logs/sorted/delivery"))
router.get('/logs/sorted/delivery', AdminController.getAllLogsSortedByDeliveryDateDesc);

// Get order logs between dates (replaces @GetMapping("/logs/between"))
router.get('/logs/between', AdminController.getOrderLogsBetweenDates);

