// // Basic server.js code 
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // CORS configuration
// const corsOptions = {
//   origin: 'http://localhost:4200',
//   credentials: true,
// };
// app.use(cors(corsOptions));

// // Middleware
// app.use(express.json());

// // Serve static files (profile pictures)
// app.use('/uploads', express.static('uploads'));

// // Basic route
// app.get('/', (req, res) => {
//   res.send('Node Product Backend Working');
// });

// // Auth routes
// const authRoutes = require('./routes/authRoutes');
// const { authenticateToken } = require('./middleware/authMiddleware');

// app.use('/api/auth', authRoutes);

// // Protected route example
// app.get('/api/user/profile', authenticateToken, (req, res) => {
//   res.json({ user: req.user });
// });

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('MongoDB Connected');
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }).catch(err => console.error(err));

// -------- NEW SERVER.JS IMPLEMENTATION ------------

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.use(cors({
    origin : process.env.CLIENT_URL || 'http://localhost:3000',
    credentials : true,
    methods : ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeader : ['Content-Type' , 'Authorization']
}));

// Serve uploaded files (replaces Spring Boot static resource handling)
app.use('/uploads' , express.static(path.join(__dirname , 'uploads')));

// Import routes 

const authRoutes = require('./routes/authRoutes');
// Use routes
app.use('/api/auth' , authRoutes);

const AuthController = require('./controllers/authController');
AuthController.initializeAdmin();



app.use((err , req , res , next) => {
    console.error(err.stack);
    res.status(500).json({message : 'Something went wrong!'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`);
})

