import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);
    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden rounded-lg'>
                <img 
                    className='w-full h-64 sm:h-72 md:h-80 object-cover hover:scale-110 transition ease-in-out duration-300' 
                    src={image[0]} 
                    alt={name}  
                />
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className='text-sm font-medium'>{currency}{formatPrice(price)}</p>
        </Link>
    );
}

export default ProductItem;