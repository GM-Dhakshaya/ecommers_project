import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import { formatPrice } from '../utils/formatPrice'

const CartTotal = () => {

    const {currency, delivery_fee, getCartAmount, cartItems} = useContext(ShopContext);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        const amount = getCartAmount();
        setSubtotal(amount);
    }, [cartItems, getCartAmount]);

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={' TOTAL'} />
        </div>
        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency} {formatPrice(subtotal)}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {formatPrice(delivery_fee)}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{currency} {formatPrice(subtotal === 0 ? 0 : subtotal + delivery_fee)}.00</b>
            </div>
        </div>
    </div>
  )
}

export default CartTotal