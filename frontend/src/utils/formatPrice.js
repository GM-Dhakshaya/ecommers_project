// Utility function to format prices with commas
export const formatPrice = (price) => {
  if (typeof price !== 'number') {
    price = Number(price);
  }
  
  if (isNaN(price)) {
    return '0';
  }
  
  return price.toLocaleString('en-IN');
}; 