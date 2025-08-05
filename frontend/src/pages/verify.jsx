import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const verify = () => {
    const {navigate, token, setCartItems, backendUrl} = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderID');

    // Function to extract user ID from token
    const getUserIdFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch (error) {
            console.log('Error parsing token:', error);
            return null;
        }
    };

    const verifyPayment = async()=>{
        try{
            
            if(!token){
                return null
            }
            const response = await axios.post(backendUrl + '/api/order/verifyStripe', {
                success, 
                orderId, 
                userId: getUserIdFromToken(token)
            }, {headers:{token}});
            
            if(response.data.success){
                setCartItems({});
                navigate('/orders');
            }else{
                navigate('/cart');
            }

        }catch(error){
            console.log('Error in verifyPayment:', error);
            toast.error(error.message);
            navigate('/cart');
        }

    }

    useEffect(()=>{
        verifyPayment();
    },[token])

  return (
    <div>

    </div>
  )
}

export default verify