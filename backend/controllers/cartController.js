
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// add product to user cart
const addToCart = async(req,res)=>{
    try{
        const {userId, itemId, size} = req.body;
        console.log('addToCart request:', { userId, itemId, size });
        
        // Find the user using Sequelize
        const userData = await User.findByPk(userId);
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Get current cart data (initialize if empty)
        let cartData = userData.cartData || {};
        console.log('Current cart data:', cartData);
        
        // Create unique key for the item
        const itemKey = size ? `${itemId}_${size}` : itemId;
        console.log('Item key:', itemKey);
        
        if (cartData[itemKey]) {
            // Item already exists, increment quantity
            cartData[itemKey].quantity += 1;
        } else {
            // Add new item to cart
            // Get product details
            const product = await Product.findByPk(itemId);
            if (product) {
                cartData[itemKey] = {
                    id: itemId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size: size || '',
                    quantity: 1
                };
            } else {
                cartData[itemKey] = {
                    id: itemId,
                    size: size || '',
                    quantity: 1
                };
            }
        }
        
        console.log('Final cart data structure:', cartData);

        // Update user's cart data using Sequelize
        await User.update(
            { cartData: cartData },
            { where: { id: userId } }
        );

        // Verify the update by fetching the user again
        const updatedUser = await User.findByPk(userId);
        console.log('Verified cart data after add:', updatedUser.cartData);
        
        console.log('Sending success response');
        res.json({ 
            success: true, 
            message: 'Item added to cart successfully',
            cartData: updatedUser.cartData || cartData
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// update user cart
const updateCart = async(req,res)=>{
    try {
        const {userId, itemId, size, quantity} = req.body;
        console.log('updateCart request:', { userId, itemId, size, quantity });
        
        // Find the user using Sequelize
        const userData = await User.findByPk(userId);
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        let cartData = userData.cartData || {};
        const itemKey = size ? `${itemId}_${size}` : itemId;
        console.log('Item key for update:', itemKey);
        console.log('Current cart data before update:', cartData);
        
        if (quantity === 0) {
            // Remove item from cart
            delete cartData[itemKey];
            console.log('Removing item from cart:', itemKey);
        } else {
            // Update quantity
            if (cartData[itemKey]) {
                cartData[itemKey].quantity = quantity;
                console.log('Updating quantity for item:', itemKey, 'to:', quantity);
            } else {
                // If item doesn't exist, add it with product details
                const product = await Product.findByPk(itemId);
                if (product) {
                    cartData[itemKey] = {
                        id: itemId,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        size: size || '',
                        quantity: quantity
                    };
                    console.log('Adding new item to cart:', cartData[itemKey]);
                }
            }
        }

        console.log('Cart data after update:', cartData);

        // Update user's cart data using Sequelize
        await User.update(
            { cartData: cartData },
            { where: { id: userId } }
        );
        
        // Verify the update by fetching the user again
        const updatedUser = await User.findByPk(userId);
        console.log('Verified cart data after database update:', updatedUser.cartData);

        res.json({ 
            success: true, 
            message: 'Cart updated successfully',
            cartData: updatedUser.cartData || cartData
        });

    } catch (error) {
        console.log('Error in updateCart:', error);
        res.json({ success: false, message: error.message });
    }
}



// get user cart data
const getUserCart = async(req,res)=>{
    try {
        const userId = req.body.userId; // Get userId from request body since it's a POST route
        
        // Find the user using Sequelize
        const userData = await User.findByPk(userId);
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        console.log('getUserCart - returning cart data:', userData.cartData || {});
        res.json({ 
            success: true, 
            cartData: userData.cartData || {}
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {addToCart,updateCart,getUserCart};