import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({token}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isBestseller, setIsBestseller] = useState(false);

  // Category to sub-category mapping (same as your frontend)
  const categoryMap = {
    Men: ['Topwear', 'Bottomwear', 'Winterwear'],
    Women: ['Topwear', 'Bottomwear', 'Winterwear'],
    Kids: ['Topwear', 'Bottomwear', 'Winterwear'],
    Electronics: ['Mobile Phones', 'Laptops', 'Headphones', 'Accessories'],
    Home: ['Furniture', 'Kitchen', 'Decor', 'Lighting'],
    Beauty: ['Skincare', 'Makeup', 'Haircare', 'Fragrances'],
    Sports: ['Gym Equipment', 'Clothing', 'Shoes', 'Accessories'],
    Toys: ['Educational', 'Action Figures', 'Dolls', 'Puzzles'],
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubCategory(''); // Reset sub-category when category changes
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  const handleSizeClick = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !description || !price || !selectedCategory || !selectedSubCategory) {
      alert('Please fill all required fields');
      return;
    }

    // Check if at least one image is uploaded
    const uploadedImages = [image1, image2, image3, image4].filter(Boolean);
    if (uploadedImages.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    // For clothing categories, sizes are required
    if ((selectedCategory === 'Men' || selectedCategory === 'Women' || selectedCategory === 'Kids') && selectedSizes.length === 0) {
      alert('Please select at least one size for clothing items');
      return;
    }

    // Create form data for file upload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', selectedCategory);
    formData.append('subCategory', selectedSubCategory);
    formData.append('bestseller', isBestseller);
    
    // Add sizes if selected
    if (selectedSizes.length > 0) {
      formData.append('sizes', JSON.stringify(selectedSizes));
    }

    // Add images
    if (image1) formData.append('image1', image1);
    if (image2) formData.append('image2', image2);
    if (image3) formData.append('image3', image3);
    if (image4) formData.append('image4', image4);

    console.log('Form data:', {
      name,
      description,
      price,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      sizes: selectedSizes,
      bestseller: isBestseller,
      images: [image1, image2, image3, image4].filter(Boolean)
    });

    // API call to backend
    try {
      const response= await axios.post(backendUrl + '/api/product/add', formData,{headers:{token}})
      if(response.data.success){
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setPrice('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setSelectedSizes([])
        setSelectedSubCategory('')
        setSelectedCategory('')
        setIsBestseller(false)
      }else{
        toast.error(response.data.message)
      } 
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }




  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input type="file" id="image1" hidden onChange={(e)=>setImage1(e.target.files[0])}/>
          </label>
          <label htmlFor="image2">
            <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input type="file" id="image2" hidden onChange={(e)=>setImage2(e.target.files[0])}/>
          </label>
          <label htmlFor="image3">
            <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input type="file" id="image3" hidden onChange={(e)=>setImage3(e.target.files[0])}/>
          </label>
          <label htmlFor="image4">
            <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input type="file" id="image4" hidden onChange={(e)=>setImage4(e.target.files[0])}/>
          </label>
        </div>
      </div>
             <div className='w-full'>
         <p className='mb-2'>Product Name <span className='text-red-500'>*</span></p>
                   <input onChange={(e)=>setName(e.target.value)} value={name || ''} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="text" placeholder='Type here' required/>
       </div>
       <div className='w-full'>
         <p className='mb-2'>Product Description <span className='text-red-500'>*</span></p>
                   <textarea onChange={(e)=>setDescription(e.target.value)} value={description || ''} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' placeholder='Type here' required />
       </div>
      <div className='w-full flex gap-4'>
                 <div className='flex-1'>
           <p className='mb-2'>Product Category <span className='text-red-500'>*</span></p>
          <select 
            className='w-full px-3 py-2 border border-gray-300 rounded'
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Electronics">Electronics</option>
            <option value="Home">Home</option>
            <option value="Beauty">Beauty</option>
            <option value="Sports">Sports</option>
            <option value="Toys">Toys</option>
          </select>
        </div>
                 <div className='flex-1'>
           <p className='mb-2'>Product Sub-Category <span className='text-red-500'>*</span></p>
          <select 
            className='w-full px-3 py-2 border border-gray-300 rounded'
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            disabled={!selectedCategory}
          >
            <option value="">Select Sub-Category</option>
            {selectedCategory && categoryMap[selectedCategory]?.map((subCat) => (
              <option key={subCat} value={subCat}>
                {subCat}
              </option>
            ))}
          </select>
        </div>
      </div>
             <div className='w-full'>
         <p className='mb-2'>Product Price <span className='text-red-500'>*</span></p>
                 <input onChange={(e)=>setPrice(e.target.value)} value={price || ''} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="number" placeholder='Enter price' required />
      </div>
      {/* Show sizes only for clothing categories */}
      {(selectedCategory === 'Men' || selectedCategory === 'Women' || selectedCategory === 'Kids') && (
        <div className='w-full'>
          <p className='mb-2'>Product Sizes <span className='text-red-500'>*</span></p>
          {selectedSizes.length > 0 && (
            <p className='text-sm text-gray-600 mb-2'>Selected: {selectedSizes.join(', ')}</p>
          )}
          <div className='flex gap-3'>
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div key={size}>
                                 <p 
                   className={`px-3 py-1 cursor-pointer rounded transition-colors ${
                     selectedSizes.includes(size) 
                       ? 'bg-orange-300 text-white' 
                       : 'bg-slate-200 hover:bg-slate-300'
                   }`}
                   onClick={() => handleSizeClick(size)}
                 >
                  {size}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className='w-full'>
        <label className='flex items-center gap-2'>
          <input onChange={(e)=>setIsBestseller(prev=>!prev)} checked={isBestseller} type="checkbox" />
          <span>Mark as Bestseller</span>
        </label>
      </div>
      <button type="submit" className='bg-black text-white px-6 py-2 rounded'>
        Add Product
      </button>
    </form>
  )
}

export default Add