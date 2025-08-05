import React from 'react';
import Title from '../components/Title';
import NewsLetter from '../components/NewsLetter';

const About = () => {
  return (
    <>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative z-[-1]" style={{backgroundImage: "url('/src/assets/aboutb.png')"}}>
        {/* Lighter overlay for better image visibility */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Centered content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <Title text1={'ABOUT'} text2={' US'} />
            
            <div className="mt-8 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white drop-shadow-lg">Welcome to Our Store</h2>
              
              <p className="text-lg sm:text-xl leading-relaxed mb-6 text-white drop-shadow-md">
                We are passionate about bringing you the finest quality products at competitive prices. 
                Our commitment to excellence and customer satisfaction drives everything we do.
              </p>
              
              <p className="text-lg sm:text-xl leading-relaxed mb-6 text-white drop-shadow-md">
                Founded with a vision to create an exceptional shopping experience, we curate our collection 
                with care, ensuring each item meets our high standards of quality and style.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/30 transition-all duration-300 hover:scale-105 hover:bg-black/60 hover:shadow-xl hover:shadow-white/20 cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2 text-white">Quality</h3>
                  <p className="text-sm text-white">Premium products that last</p>
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/30 transition-all duration-300 hover:scale-105 hover:bg-black/60 hover:shadow-xl hover:shadow-white/20 cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2 text-white">Service</h3>
                  <p className="text-sm text-white">Exceptional customer support</p>
                </div>
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/30 transition-all duration-300 hover:scale-105 hover:bg-black/60 hover:shadow-xl hover:shadow-white/20 cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2 text-white">Trust</h3>
                  <p className="text-sm text-white">Reliable and secure shopping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter section below background image */}
      <div className="py-16 bg-gray-50">
        <NewsLetter />
      </div>
    </>
  );
};

export default About;

