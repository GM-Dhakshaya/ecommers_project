import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Array of shoe images for the slider
  const shoeImages = [
    assets.shoeh,
    assets.shoeb, 
    assets.shoem,
    assets.shoeg,
    assets.shoed
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % shoeImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [shoeImages.length]);

  // Manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % shoeImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + shoeImages.length) % shoeImages.length);
  };

  return (
    <div className='relative min-h-[200px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden'>
      {/* Full Background Image Slider */}
      <div className="absolute inset-0 w-full h-full">
        {shoeImages.map((image, index) => (
          <img
            key={index}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
            src={image}
            alt={`Shoe ${index + 1}`}
          />
        ))}
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Hero Content - Centered */}
      <div className='relative z-10 flex items-center justify-center h-full px-4 sm:px-8'>
        <div className='text-center text-white'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <p className='w-8 md:w-11 h-[2px] bg-white'></p>
            <p className='font-medium text-xs sm:text-sm md:text-base text-white'>TRENDING NOW</p>
          </div>
          <h2 className='prata-regular text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-relaxed mb-4 text-white'>
            FRESH ON THE RACK
          </h2>
          <div className='flex items-center justify-center gap-2'>
            <p className='font-semibold text-xs sm:text-sm md:text-base text-white'>SHOP NOW</p>
            <p className='w-8 md:w-11 h-[1px] bg-white'></p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-20"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-20"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {shoeImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>


    </div>
  )
}

export default Hero
