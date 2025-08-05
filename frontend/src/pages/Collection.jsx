import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useLocation } from 'react-router-dom';

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

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showSubFilter, setShowSubFilter] = useState(false);
  const [sortType, setSortType] = useState('relevance');

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const applyFilters = () => {
    let productsCopy = products.slice();

    if(showSearch && search){
      productsCopy = productsCopy.filter(item=>item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }

    setFilteredProducts(productsCopy);
  };

  const sortProducts = () => {
    let fpCopy = [...filteredProducts];

    switch (sortType) {
      case 'price-asc':
        fpCopy.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        fpCopy.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        fpCopy.sort((a, b) => b.date - a.date);
        break;
      case 'oldest':
        fpCopy.sort((a, b) => a.date - b.date);
        break;
      default:
        applyFilters();
        return;
    }

    setFilteredProducts(fpCopy);
  };

  useEffect(() => {
    applyFilters();
  }, [category, subCategory, search,showSearch,products]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  const uniqueSubCategories = [
    ...new Set(category.flatMap((mainCat) => categoryMap[mainCat] || [])),
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Panel */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Categories */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {Object.keys(categoryMap).map((cat) => (
              <label key={cat} className="flex gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3"
                  value={cat}
                  checked={category.includes(cat)}
                  onChange={toggleCategory}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Sub-Categories */}
        {uniqueSubCategories.length > 0 && (
          <div className="border border-gray-300 pl-5 py-3 mt-6">
            <p
              className="mb-3 text-sm font-medium flex items-center cursor-pointer gap-2"
              onClick={() => setShowSubFilter((prev) => !prev)}
            >
              SUB-CATEGORIES
              <img
                className={`h-3 sm:hidden transition-transform ${
                  showSubFilter ? 'rotate-90' : ''
                }`}
                src={assets.dropdown_icon}
                alt=""
              />
            </p>
            <div
              className={`${
                showSubFilter ? '' : 'hidden'
              } sm:block flex flex-col gap-2 text-sm font-light text-gray-700`}
            >
              {uniqueSubCategories.map((subCat) => (
                <label key={subCat} className="flex gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3"
                    value={subCat}
                    checked={subCategory.includes(subCat)}
                    onChange={toggleSubCategory}
                  />
                  {subCat}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Side Product Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center sm:text-2xl mb-4">
          <Title text1={'Collection'} text2={'Products'} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((item, index) => (
            <ProductItem
              key={index}
                                  id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
