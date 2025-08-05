import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency, formatPrice } from '../App'
import { toast } from 'react-toastify'

const List = ({token}) => {
  const [list, setList] = useState([])

  const featchlist= async()=>{
    try {
      const response= await axios.get(backendUrl + '/api/product/list')
      if(response.data.success){
        setList(response.data.products)
      }else{
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const removeProduct= async(id)=>{
    try {
      console.log('Removing product with ID:', id);
      const response= await axios.post(backendUrl + '/api/product/remove/',{id: parseInt(id)}, {headers:{token}})

      if(response.data.success){
        toast.success(response.data.message)
        featchlist()
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error('Error removing product')
    }
  }

  useEffect(()=>{
    featchlist()
  },[])

  return (
    <>
    <p className='mb-2'>All Products</p>
    <div className='flex flex-col gap-2'>
      {/* List Table title */}
      <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b>Action</b>
      </div>
      {/* Product List */}
      {list.map((item,index)=>(
        <div key={index}>
          {/* Desktop Layout */}
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'>
            <img className='w-12 h-12 object-cover' src={item.image[0]} alt="" />
            <p className='truncate'>{item.name}</p>
            <p>{item.category}</p>
                         <p>{currency}{formatPrice(item.price)}</p>
                         <p onClick={()=>removeProduct(item.id)} className='text-center cursor-pointer text-lg hover:text-red-500'>X</p>
          </div>
                     {/* Mobile Layout */}
           <div className='md:hidden grid grid-cols-[1fr_3fr_1fr] items-center gap-2 py-1 px-2 border text-sm'>
             <img className='w-12 h-12 object-cover' src={item.image[0]} alt="" />
             <div>
               <p className='truncate font-medium'>{item.name}</p>
               <p className='text-xs text-gray-600'>{item.category} • {currency}{formatPrice(item.price)}</p>
             </div>
                           <p onClick={()=>removeProduct(item.id)} className='text-right cursor-pointer text-lg hover:text-red-500'>X</p>
           </div>
        </div>
      ))}
    </div>
    </>
  )
}

export default List