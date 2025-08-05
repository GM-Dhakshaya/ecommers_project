import React, { useState, useContext } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const {navigate, backendUrl, token, cartItems, setCartItems, getCartItems, delivery_fee, products,getCartAmount} = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  })

  const onChangeHandler = (event) => {
    const name=event.target.name;
    const value=event.target.value;
    setFormData(data => ({...data, [name]: value}))
  }

  const initPay=(order)=>{
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async(response)=>{
        try{
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.id;
          
          const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', {
            userId: userId,
            razorpay_order_id: response.razorpay_order_id
          }, {headers:{token}})
          
          if(data.success){
            setCartItems({});
            navigate('/orders');
          }else{
            toast.error(data.message);
          }
        }catch(error){
          console.log('Error in payment verification:', error);
          toast.error(error.message);
        }
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  // const onSubmitHandler = async (event) => {
  //   event.preventDefault();
  //   try{
  //     console.log("cartItems:", cartItems);
  //     console.log("products:", products);
  //     let orderItems = []

  //     for (const items in cartItems){
  //       console.log("Current items key:", items);
  //       for(const item in cartItems[items]){
  //         console.log("Current item key:", item);
  //         console.log("Quantity:", cartItems[items][item]);
  //         if (cartItems[items][item] > 0){
  //           const itemInfo = structuredClone(products.find(product=>product.id === cartItems[items].id));
  //           console.log("Found itemInfo:", itemInfo);
  //           if(itemInfo){
  //             itemInfo.size=item
  //             itemInfo.quantity=cartItems[items][item]
  //             orderItems.push(itemInfo)
  //           }
  //         }
  //       }
  //     }

  //     console.log(orderItems);

  //   }catch(error){
  //     console.log(error);
  //   }
  // }




  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try{
      
      let orderItems = []
  
      for (const cartKey in cartItems){
        const cartItem = cartItems[cartKey];
        
        if (cartItem.quantity > 0){
          // Use 'id' instead of '_id' for database products
          const itemInfo = structuredClone(products.find(product => product.id == cartItem.id));
          if(itemInfo){
            itemInfo.size = cartItem.size;
            itemInfo.quantity = cartItem.quantity;
            orderItems.push(itemInfo);
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      }
      switch(method){
        // API Calls for Cod
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers:{token}});
          if(response.data.success){
            setCartItems({});
            navigate('/orders');
          }else{
            toast.error(response.data.message);
          }
          break;

        // API Calls for Stripe
        case 'stripe':
          const responseStripe=await axios.post(backendUrl + '/api/order/stripe', orderData, {headers:{token}});
          if(responseStripe.data.success){
            const {session_url} = responseStripe.data;
            window.location.replace(session_url);
          }else{
            toast.error(responseStripe.data.message);
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers:{token}});
          if(responseRazorpay.data.success){
            initPay(responseRazorpay.data.order);
          }

          break;

        default:
          break;
      }

  
    }catch(error){
      console.log(error);
      toast.error(error.message);
    }
  }





  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={' INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder='Email' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='postalCode' value={formData.postalCode} type="text" placeholder='Postal Code' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder='Country' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="text" placeholder='Phone Number' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
      </div>
      {/* Payment Information */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={' METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={()=> setMethod('stripe')} className='flex items-center gap-3 border py-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-black' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={()=> setMethod('razorpay')} className='flex items-center gap-3 border py-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-black' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={()=> setMethod('cod')} className='flex items-center gap-3 border py-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-black' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white text-sm my-8 px-8 py-3'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
