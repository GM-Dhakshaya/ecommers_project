import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Stripe from 'stripe';
import razorpay from 'razorpay';

//global variables
const currency = 'inr';
const deliveryCharge = 100;

//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance =new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const placeOrder = async(req,res)=>{
    try{
        const {userId,items, amount, address} = req.body;

        //const userId = req.user.id;
        
        // Create order data for Sequelize
        const orderData = {
            userId: parseInt(userId),
            items: items,
            amount: amount,
            address: address,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        };

        // Create order using Sequelize
        const newOrder = await Order.create(orderData);

        // Clear user's cart using Sequelize
        //await User.update(userId, {cartData: {}});
        await User.update({cartData: {}}, {where: {id: userId}});

        res.json({success: true, message: 'Order Placed Successfully'});

    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

const placeOrderStripe = async(req,res)=>{
    try{
        const {userId,items, amount, address} = req.body;
        const {origin} = req.headers;

        const orderData = {
            userId: parseInt(userId),
            items: items,
            amount: amount,
            address: address,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now()
        };

        const newOrder = await Order.create(orderData);
        // Don't clear cart here - only clear after successful payment

        const line_items = items.map((item)=>({
            price_data:{
                currency: currency,
                product_data:{
                    name: item.name,
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity,
        }))


        line_items.push({
            price_data:{
                currency: currency,
                product_data:{
                    name: 'Delivery Charge'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1,
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderID=${newOrder.id}`,
            cancel_url: `${origin}/verify?success=false&orderID=${newOrder.id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({success: true, session_url:session.url});

    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }

}

//verify Stripe
const verifyStripe = async(req,res)=>{
    const {orderId, success, userId} = req.body;
    try{
        if(success === 'true'){
            await Order.update({payment: true}, {where: {id: orderId}});
            await User.update({cartData: {}}, {where: {id: userId}}); 
            res.json({success: true, message: 'Payment verified successfully'});
        }else{
            await Order.destroy({where: {id: orderId}});
            res.json({success: false, message: 'Payment failed'});
        }
    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

const placeOrderRazorpay = async(req,res)=>{
    try{
        const {userId,items, amount, address} = req.body;

        const orderData = {
            userId: parseInt(userId),
            items: items,
            amount: amount,
            address: address,
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now()
        }
        const newOrder = await Order.create(orderData);
        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder.id.toString(),
        }
        razorpayInstance.orders.create(options)
            .then((order) => {
                res.json({success: true, order});
            })
            .catch((error) => {
                console.log(error);
                res.json({success: false, message: error.message});
            });

    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});

    }
}

const verifyRazorpay = async(req,res)=>{
    try{
        const{userId, razorpay_order_id} = req.body
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid'){
            await Order.update({payment: true}, {where: {id: orderInfo.receipt}})
            await User.update({cartData: {}}, {where: {id: userId}})
            res.json({success: true, message: 'Payment successfully'})
        }else{
            res.json({success: false, message: 'Payment failed'})
        }
    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


// const verifyRazorpay = async(req,res)=>{
//     try{
//         const {orderId, success, userId, razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;
        
//         if(success === 'true'){
//             // Verify payment signature here if needed
//             const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
            
//             if(orderInfo.status === 'paid'){
//                 await Order.update({payment: true}, {where: {id: orderId}});
//                 await User.update({cartData: {}}, {where: {id: userId}});
//                 res.json({success: true, message: 'Payment verified successfully'});
//             }else{
//                 await Order.destroy({where: {id: orderId}});
//                 res.json({success: false, message: 'Payment failed'});
//             }
//         }else{
//             await Order.destroy({where: {id: orderId}});
//             res.json({success: false, message: 'Payment failed'});
//         }
//     }catch(error){
//         console.log(error);
//         res.json({success: false, message: error.message});
//     }
// }





const allOrders = async(req,res)=>{
    try{
        const orders=await Order.findAll({
            order: [['createdAt', 'DESC']] 
        });
        res.json({success: true, orders});

    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}


const userOrders = async(req,res)=>{
    try{
        const userId = req.body.userId; 
        const orders = await Order.findAll({
            where: {userId: userId},
            order: [['createdAt', 'DESC']] 
        });
        res.json({success: true, orders});
    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}


const updateStatus = async(req,res)=>{
    try{
        const {orderId, status} = req.body;
        await Order.update(
            { status: status },
            { where: { id: orderId } }
        );
        res.json({success: true, message: 'Order Status Updated Successfully'});
    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export {verifyRazorpay, placeOrder, userOrders, allOrders, updateStatus, placeOrderStripe, verifyStripe, placeOrderRazorpay};
