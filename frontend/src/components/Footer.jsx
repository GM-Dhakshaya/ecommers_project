import React from 'react'
import { assets } from '../assets/assets'
const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
          <div>
            <img src={assets.logo1}className='mb-2 w-20' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
            ShopMee is your trusted destination for quality products at unbeatable value. From fashion to electronics, we bring you the latest trends with a focus on quality, convenience, and customer satisfaction.
            </p>
          </div>
          <div>
            <p className=' text-xl font-medium mb-10'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
              <li>Home</li>
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact Us</li>
              <li>Our Store</li>
            </ul>
          </div>
          <div>
            <p className=' text-xl font-medium mb-10'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
              <li>+91 9876543210</li>
              <li>shopmee@gmail.com</li>
              <li>123, Main Street, Anytown, USA</li>
              <li>
                <img src={assets.facebook} alt="" />
                <img src={assets.instagram} alt="" />
                <img src={assets.twitter} alt="" />
              </li>
            </ul>
          </div>

      </div>   
         <div>
             <hr />
             <p className='py-5 text-sm text-center'>Copyright 2025@ ShopMee.Com All Rights Reserved.</p>
          </div>    
    </div>
  )
}

export default Footer