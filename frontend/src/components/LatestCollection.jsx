import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';


const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        // Sort products by date (newest first) and take the first 10
        const sortedProducts = products.sort((a, b) => b.date - a.date).slice(0, 5);
        setLatestProducts(sortedProducts);
    }, [products]);

  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text1={'NEW'} text2={'ARRIVALS'} />
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Fresh fashion and gear just in — don’t miss our newest arrivals!
            </p>
        </div>
        {/* Rendering Products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {
            latestProducts.map((item,index) => (
                                  <ProductItem key={index} id={item.id} image={item.image} name={item.name} price={item.price} />
            ))
          }
        </div>
    </div>
  )
}

export default LatestCollection
