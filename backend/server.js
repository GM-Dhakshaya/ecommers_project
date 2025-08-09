import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import sequelize from './config/postgredb.js'; 
import connectCloudinary from './config/cloudinary.js';
import User from './routes/userRoute.js';
  import productRouter from './routes/productRoute.js';
import './models/userModel.js';
import './models/productModel.js';
import './models/orderModel.js';
import cartRouter from './routes/cartRout.js';
import orderRouter from './routes/orderRout.js';


const app = express();
const port = process.env.PORT || 8080;

connectCloudinary();

app.use(express.json());
app.use(cors());

app.use('/api/user', User);
app.use('/api/product',productRouter );
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);

app.get('/', (req, res) => {
  res.send("API WORKING");
});

// Test database endpoint
app.get('/test-db', async (req, res) => {
  try {
    const User = (await import('./models/userModel.js')).default;
    const Product = (await import('./models/productModel.js')).default;
    const Order = (await import('./models/orderModel.js')).default;
    
    const userCount = await User.count();
    const productCount = await Product.count();
    const orderCount = await Order.count();
    
    res.json({
      success: true,
      message: 'Database connection working',
      userCount,
      productCount,
      orderCount
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
});

// Test cart endpoint
app.post('/test-cart', async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    console.log('Test cart request:', { userId, itemId, size });
    
    const User = (await import('./models/userModel.js')).default;
    const userData = await User.findByPk(userId);
    
    if (!userData) {
      return res.json({ success: false, message: 'User not found' });
    }
    
    console.log('User found:', userData.id);
    console.log('Current cart data:', userData.cartData);
    
    res.json({
      success: true,
      message: 'Cart test successful',
      user: { id: userData.id, cartData: userData.cartData }
    });
  } catch (error) {
    console.log('Cart test error:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
});

// Test DB connection and sync tables
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected successfully');
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);
    console.log('Host:', process.env.DB_HOST);
    
    // Sync all models with database (create tables) - force: false to preserve data
    return sequelize.sync({ force: false }); // Changed from true to false
  })
  .then(() => {
    console.log('Database tables synchronized successfully');
    console.log('Available tables:', Object.keys(sequelize.models));
    
    // Check if specific tables exist with better query
    return sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
  })
  .then(([results]) => {
    console.log('Tables in database:', results.map(row => row.tablename));
  })
  .catch(err => {
    console.error('DB connection error:', err);
    console.error('Please check your database credentials and make sure PostgreSQL is running');
  });

app.listen(port, () => console.log(`Server running on port ${port}`));
