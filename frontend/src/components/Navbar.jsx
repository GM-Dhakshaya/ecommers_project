import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const [visible,setVisible]=useState(false);   
    const {showSearch, setShowSearch, getCartCount, navigate,token, setToken,setCartItems} = useContext(ShopContext);
    
    // Get admin URL from environment
    const adminUrl = import.meta.env.VITE_ADMIN_URL;
    
    const logout = ()=>{
      navigate('/login');
      localStorage.removeItem('token');
      setToken('');
      setCartItems({});
    }

    const openAdminPanel = () => {
      if (adminUrl) {
        window.open(adminUrl, '_blank');
      } else {
        console.log('Admin URL not configured');
      }
    }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-20 py-4 px-6 max-w-7xl mx-auto">
        <Link to='/'><img src={assets.logo1} alt="Logo1"className="w-36 h-auto drop-shadow-2xl" /> </Link>

        <ul className='hidden sm:flex gap-8 text-sm text-black'>
          <NavLink to='/' className='flex flex-col items-center gap-1 group'>
            <p className='font-bold transition-colors duration-300 group-hover:text-blue-600 drop-shadow-2xl text-shadow-lg'>HOME</p>
            <hr className='w-0 group-hover:w-2/4 border-none h-[2px] bg-blue-600 transition-all duration-300 drop-shadow-lg' />
          </NavLink>
          <NavLink to='/collection' className='flex flex-col items-center gap-1 group'>
            <p className='font-bold transition-colors duration-300 group-hover:text-purple-600 drop-shadow-2xl text-shadow-lg'>COLLECTION</p>
            <hr className='w-0 group-hover:w-2/4 border-none h-[2px] bg-purple-600 transition-all duration-300 drop-shadow-lg' />
          </NavLink>
          <NavLink to='/about' className='flex flex-col items-center gap-1 group'>
            <p className='font-bold transition-colors duration-300 group-hover:text-green-600 drop-shadow-2xl text-shadow-lg'>ABOUT</p>
            <hr className='w-0 group-hover:w-2/4 border-none h-[2px] bg-green-600 transition-all duration-300 drop-shadow-lg' />
          </NavLink>
          <NavLink to='/contact' className='flex flex-col items-center gap-1 group'>
            <p className='font-bold transition-colors duration-300 group-hover:text-red-600 drop-shadow-2xl text-shadow-lg'>CONTACT</p>
            <hr className='w-0 group-hover:w-2/4 border-none h-[2px] bg-red-600 transition-all duration-300 drop-shadow-lg' />
          </NavLink>
        </ul>

        <div className='flex items-center gap-4 sm:gap-6 ml-4 sm:ml-0'>
          <div className='p-2 rounded-full hover:bg-black/5 transition-colors duration-300'>
            <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 h-5 cursor-pointer drop-shadow-2xl filter drop-shadow-lg' alt="Search" />
          </div>
          
          <div className='group relative'>
            <div className='p-2 rounded-full hover:bg-black/5 transition-colors duration-300'>
              <img onClick={()=> token ? null : navigate('/login')} className='w-6 h-6 sm:w-5 sm:h-5 cursor-pointer drop-shadow-2xl filter drop-shadow-lg' src={assets.profile_icon} alt="Profile" />
            </div>
            
            {/* Drop Down Menu */}
            <div className='group-hover:block hidden absolute right-0 pt-4'>
            <div className='flex flex-col gap-2 w-40 py-3 px-4 bg-white/90 backdrop-blur-md text-black rounded-xl shadow-2xl border border-black/10'>
              <p className='cursor-pointer hover:text-blue-600 transition-colors duration-300 font-medium'>My Profile</p>
              <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-blue-600 transition-colors duration-300 font-medium'>Orders</p>
              <hr className='border-black/10' />
              <p onClick={openAdminPanel} className='cursor-pointer hover:text-yellow-600 transition-colors duration-300 font-medium'>Admin Panel</p>
              <p onClick={logout} className='cursor-pointer hover:text-red-600 transition-colors duration-300 font-medium'>Logout</p>
            </div>
          </div>
            
          </div>
          
          <Link to='/cart' className='relative p-2 rounded-full hover:bg-black/5 transition-colors duration-300'>
            <img src={assets.cart_icon} className='w-5 h-5 min-w-5 drop-shadow-2xl filter drop-shadow-lg' alt="" />
            {getCartCount() > 0 && (
              <p className='absolute -top-1 -right-1 w-5 h-5 text-center leading-5 bg-red-500 text-white aspect-square rounded-full text-xs font-bold shadow-2xl'>{getCartCount()}</p>
            )}
          </Link>
          
          <div className='p-2 rounded-full hover:bg-black/5 transition-colors duration-300 sm:hidden'>
            <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-6 h-6 cursor-pointer drop-shadow-2xl filter drop-shadow-lg' alt="" />
          </div>
        </div>
      </div>

        {/* Advanced Sidebar menu for mobile screens */}
        <div className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-2xl transform transition-all duration-500 ease-in-out z-50 ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Sidebar Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-white'>
            <div className='flex items-center gap-3'>
              <img src={assets.logo1} alt="Logo" className="w-8 h-auto" />
              <h2 className='text-gray-800 font-bold text-lg'>ShopMee</h2>
            </div>
            <button 
              onClick={()=>setVisible(false)} 
              className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300'
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className='flex flex-col p-6 space-y-2'>
            <NavLink 
              onClick={()=>setVisible(false)} 
              to='/' 
              className='flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group border border-transparent hover:border-blue-200'
            >
              <div className='p-2 rounded-lg bg-blue-100 group-hover:bg-blue-500 transition-colors duration-300'>
                <svg className="w-5 h-5 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className='font-medium'>HOME</span>
            </NavLink>

            <NavLink 
              onClick={()=>setVisible(false)} 
              to='/collection' 
              className='flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 group border border-transparent hover:border-purple-200'
            >
              <div className='p-2 rounded-lg bg-purple-100 group-hover:bg-purple-500 transition-colors duration-300'>
                <svg className="w-5 h-5 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className='font-medium'>COLLECTION</span>
            </NavLink>

            <NavLink 
              onClick={()=>setVisible(false)} 
              to='/about' 
              className='flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-300 group border border-transparent hover:border-green-200'
            >
              <div className='p-2 rounded-lg bg-green-100 group-hover:bg-green-500 transition-colors duration-300'>
                <svg className="w-5 h-5 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className='font-medium'>ABOUT</span>
            </NavLink>

            <NavLink 
              onClick={()=>setVisible(false)} 
              to='/contact' 
              className='flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group border border-transparent hover:border-red-200'
            >
              <div className='p-2 rounded-lg bg-red-100 group-hover:bg-red-500 transition-colors duration-300'>
                <svg className="w-5 h-5 text-red-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className='font-medium'>CONTACT</span>
            </NavLink>

            {/* Admin Panel Button for Mobile */}
            <button 
              onClick={() => {
                setVisible(false);
                openAdminPanel();
              }}
              className='w-full flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-300 group border border-transparent hover:border-yellow-200'
            >
              <div className='p-2 rounded-lg bg-yellow-100 group-hover:bg-yellow-500 transition-colors duration-300'>
                <svg className="w-5 h-5 text-yellow-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className='font-medium'>ADMIN PANEL</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className='p-6 border-t border-gray-200 bg-white'>
            <h3 className='text-gray-600 text-sm font-semibold mb-4 uppercase tracking-wider'>Quick Actions</h3>
            <div className='space-y-3'>
              <button className='w-full flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-300 group border border-transparent hover:border-yellow-200'>
                <div className='p-2 rounded-lg bg-yellow-100 group-hover:bg-yellow-500 transition-colors duration-300'>
                  <svg className="w-5 h-5 text-yellow-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className='font-medium'>Search Products</span>
              </button>
              
              <Link to='/cart' onClick={()=>setVisible(false)} className='w-full flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300 group border border-transparent hover:border-pink-200'>
                <div className='p-2 rounded-lg bg-pink-100 group-hover:bg-pink-500 transition-colors duration-300 relative'>
                  <svg className="w-5 h-5 text-pink-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  {getCartCount() > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                      {getCartCount()}
                    </span>
                  )}
                </div>
                <span className='font-medium'>View Cart</span>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className='absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white'>
            <div className='flex items-center justify-between text-gray-500 text-sm'>
              <span>© 2024 ShopMee</span>
              <div className='flex gap-3'>
                <button className='p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300'>
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className='p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300'>
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop */}
        {visible && (
          <div 
            className="fixed inset-0 bg-black/30 z-40 sm:hidden"
            onClick={() => setVisible(false)}
          />
        )}

    </div>
  );
};

export default Navbar;
