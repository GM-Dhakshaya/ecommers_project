import express from 'express';
import { placeOrder, userOrders, allOrders, updateStatus, placeOrderStripe, verifyStripe, placeOrderRazorpay ,verifyRazorpay} from '../controllers/orderControler.js';
import  adminAuth  from '../middleware/adminAuth.js';
import  authUser  from '../middleware/auth.js';

const orderRouter = express.Router();


// Admin Features
orderRouter.post('/list',adminAuth, allOrders);
orderRouter.post('/status',adminAuth, updateStatus);


// Payment Features
orderRouter.post('/place',authUser, placeOrder);
orderRouter.post('/stripe',authUser, placeOrderStripe);
orderRouter.post('/razorpay',authUser, placeOrderRazorpay);

// User Features
orderRouter.post('/user',authUser, userOrders);


//verify Stripe
orderRouter.post('/verifyStripe',verifyStripe);
orderRouter.post('/verifyRazorpay',verifyRazorpay);

export default orderRouter;