import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { formatPrice } from '../utils/formatPrice';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const fetchProductData = async () => {
    
    const foundProduct = products.find(item => item.id == productId);
    if (foundProduct) {
      //console.log('Product found:', foundProduct);
      setProductData(foundProduct);
      setImage(foundProduct.image[0]);
    } else {
      //console.log('Product not found for ID:', productId);
    }
  }
  useEffect(()=>{
    fetchProductData();
  },[productId,products]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    addToCart(productData.id, selectedSize);
  };

  //console.log('Product data state:', productData);
  
  if (!productData) {
    return <div className="pt-10 text-center">Loading product...</div>;
  }
  
  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Image */}
        <div className='flex-1 flex flex-col sm:flex-row gap-6'>
          {/* Thumbnail Images - Left Side */}
          <div className='flex flex-row sm:flex-col gap-3 w-full sm:w-24'>
            {productData.image.map((item,index)=>(
              <img
                onClick={()=>setImage(item)}
                key={index} 
                src={item} 
                alt="" 
                className='w-20 h-20 sm:w-full sm:h-24 object-cover border border-gray-200 cursor-pointer hover:border-gray-400'
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} alt="" className='w-full h-auto'/>
          </div>
        </div>
        {/* Product Details */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl'>{productData.name}</h1>
          <div className='flex items-center gap-2 mt-2'>
            <img src={assets.star_icon} alt="" className='w-3 5' />
            <img src={assets.star_icon} alt="" className='w-3 5' />
            <img src={assets.star_icon} alt="" className='w-3 5' />
            <img src={assets.star_icon} alt="" className='w-3 5' />
            <img src={assets.star_dull_icon} alt="" className='w-3 5' />
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{formatPrice(productData.price)}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          
          {/* Size Selection - Only for Clothing Categories */}
          {(productData.category === 'Men' || productData.category === 'Women' || productData.category === 'Kids') && productData.sizes && (
            <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item,index)=>(
                  <button 
                    key={index} 
                    className={`border-2 py-2 px-4 transition-colors ${
                      selectedSize === item 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSizeSelect(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <div className='mt-8'>
            <button 
              className='bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 active:bg-gray-700 transition-colors'
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <hr className='mt-8 sm:w-4/5'/>
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Orginal Product.</p>
              <p>Cash on Delivery Available.</p>
              <p>Easy Return Policy within 7 days.</p>
              <p>100% Money Back Guarantee.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Description & reviews */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (129)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>An e-commerce website is a digital storefront that enables users to explore, select, and purchase products seamlessly from the comfort of their homes. Whether it’s fashion apparel, electronics, home decor, or beauty products, a well-structured e-commerce platform simplifies shopping through organized categories, detailed product descriptions, high-quality images, and secure checkout options. </p>
          <p> Our website brings together a curated collection of items for men, women, kids, and more—ensuring there’s something for everyone. With flexible filters, real-time stock updates, and user-friendly design, the platform is built to provide an efficient, enjoyable, and trustworthy online shopping experience.</p>

        </div>
      </div>
      {/* Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />


         </div>
   )
};

export default Product;

